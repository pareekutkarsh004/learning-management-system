import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";

export const createGridFSBucket = async () => {
  const db = mongoose.connection.db;
  return new GridFSBucket(db, { bucketName: "assets" });
};
