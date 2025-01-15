import { ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import redisClient from '../utils/redis.js';
import dbClient from '../utils/db.js';
import mime from 'mime-types';

class FilesController {
	constructor() {
		const { FOLDER_PATH = "/tmp/files_manager" } = process.env;
		this.FOLDER_PATH = FOLDER_PATH;
	}

	// File upload handler
	async postUpload(req, res) {
		try {
			const tokenHeader = req.headers["x-token"];
			const userId = await redisClient.get(`auth_${tokenHeader}`);
			const user = await dbClient.db
				.collection("users")
				.findOne({ _id: new ObjectId(userId) });

			if (!user) return res.status(401).send({ error: "Unauthorized" });

			const { name, type, parentId, isPublic, data } = req.body;
			const acceptedTypes = ["folder", "file", "image"];

			if (!name) return res.status(400).send({ error: "Missing name" });
			if (!type || !acceptedTypes.includes(type))
				return res.status(400).send({ error: "Invalid type" });
			if (!data && type !== acceptedTypes[0]) 
				return res.status(400).send({ error: "Missing data" });

			// Parent file checks
			if (parentId) {
				const parent = await dbClient.db
					.collection("files")
					.findOne({ _id: new ObjectId(parentId) });

				if (!parent)
					return res.status(404).send({ error: "Parent not found" });
				if (parent.type !== "folder")
					return res.status(400).send({ error: "Parent is not a folder" });
				if (parent.userId !== user._id.toString())
					return res.status(403).send({ error: "Unauthorized" });
			}

			// Handle folder creation
			if (type === "folder") {
				const newFolder = await dbClient.db.collection("files").insertOne({
					name,
					type,
					parentId: parentId || 0,
					isPublic: isPublic || false,
					userId: user._id.toString(),
				});
				return res.status(201).send(newFolder.ops[0]);
			}

			// Handle file upload
			const path = `${this.FOLDER_PATH}/${uuidv4()}`;
			const decodedData = Buffer.from(data, "base64");

			// Ensure folder path exists
			fs.mkdirSync(this.FOLDER_PATH, { recursive: true });
			fs.writeFileSync(path, decodedData);

			const newFile = await dbClient.db.collection("files").insertOne({
				name,
				type,
				isPublic: isPublic || false,
				parentId: parentId || 0,
				localPath: path,
				userId: user._id.toString()
			});
			return res.status(201).send(newFile.ops[0]);

		} catch (err) {
			console.error("Error during file upload:", err);
			return res.status(500).send({ error: "Internal server error" });
		}
	}

	// Get file details
	async getShow(req, res) {
		try {
			const tokenHeader = req.headers["x-token"];
			const userId = await redisClient.get(`auth_${tokenHeader}`);
			const user = await dbClient.db
				.collection("users")
				.findOne({ _id: new ObjectId(userId) });

			if (!user) return res.status(401).send({ error: "Unauthorized" });

			const { id } = req.params;
			const file = await dbClient.db
				.collection("files")
				.findOne({ _id: new ObjectId(id) });

			if (!file || (file && file.userId !== user._id.toString()))
				return res.status(404).send({ error: "File not found" });

			return res.status(200).send(file);
		} catch (err) {
			console.error("Error fetching file:", err);
			return res.status(500).send({ error: "Internal server error" });
		}
	}

	// List files in a folder
	async getIndex(req, res) {
		try {
			const tokenHeader = req.headers["x-token"];
			const userId = await redisClient.get(`auth_${tokenHeader}`);
			const user = await dbClient.db
				.collection("users")
				.findOne({ _id: new ObjectId(userId) });

			if (!user) return res.status(401).send({ error: "Unauthorized" });

			const { parentId, page = 0 } = req.query;
			const limit = 20;
			const skip = page * limit;

			const files = await dbClient.db
				.collection("files")
				.aggregate([
					{ $match: { parentId } },
					{ $skip: skip },
					{ $limit: limit }
				])
				.toArray();

			return res.status(200).send(files);
		} catch (err) {
			console.error("Error fetching files:", err);
			return res.status(500).send({ error: "Internal server error" });
		}
	}

	// Publish a file
	async putPublish(req, res) {
		try {
			const tokenHeader = req.headers["x-token"];
			const userId = await redisClient.get(`auth_${tokenHeader}`);
			const user = await dbClient.db
				.collection("users")
				.findOne({ _id: new ObjectId(userId) });

			if (!user) return res.status(401).send({ error: "Unauthorized" });

			const { id } = req.params;
			const file = await dbClient.db
				.collection("files")
				.findOne({ _id: new ObjectId(id) });

			if (!file) return res.status(404).send({ error: "File not found" });

			file.isPublic = true;
			await dbClient.db
				.collection("files")
				.updateOne({ _id: new ObjectId(id) }, { $set: file });

			return res.status(200).send(file);
		} catch (err) {
			console.error("Error publishing file:", err);
			return res.status(500).send({ error: "Internal server error" });
		}
	}

	// Unpublish a file
	async putUnpublish(req, res) {
		try {
			const tokenHeader = req.headers["x-token"];
			const userId = await redisClient.get(`auth_${tokenHeader}`);
			const user = await dbClient.db
				.collection("users")
				.findOne({ _id: new ObjectId(userId) });

			if (!user) return res.status(401).send({ error: "Unauthorized" });

			const { id } = req.params;
			const file = await dbClient.db
				.collection("files")
				.findOne({ _id: new ObjectId(id) });

			if (!file) return res.status(404).send({ error: "File not found" });

			file.isPublic = false;
			await dbClient.db
				.collection("files")
				.updateOne({ _id: new ObjectId(id) }, { $set: file });

			return res.status(200).send(file);
		} catch (err) {
			console.error("Error unpublishing file:", err);
			return res.status(500).send({ error: "Internal server error" });
		}
	}

	// Serve file data
	async getFile(req, res) {
		try {
			const tokenHeader = req.headers["x-token"];
			const userId = await redisClient.get(`auth_${tokenHeader}`);
			const user = await dbClient.db
				.collection("users")
				.findOne({ _id: new ObjectId(userId) });

			const { id } = req.params;
			const file = await dbClient.db
				.collection("files")
				.findOne({ _id: new ObjectId(id) });

			if (!file) return res.status(404).json({ error: "File not found" });

			if (!file.isPublic && (user?._id.toString() !== file.userId || !tokenHeader)) {
				return res.status(403).json({ error: "Not authorized" });
			}

			if (file.type === "folder") {
				return res.status(400).json({ error: "A folder doesn't have content" });
			}

			const contentType = mime.lookup(file.name);
			res.setHeader("Content-Type", contentType);
			fs.createReadStream(file.localPath).pipe(res);
		} catch (err) {
			console.error("Error retrieving file data:", err);
			return res.status(500).json({ error: "Internal server error" });
		}
	}
}

const filesController = new FilesController();
export default filesController;
