export default class Document {
  constructor({ id, filename, storedFilename, size, mimetype, path, createdAt, summary }) {
    this.id = id;
    this.filename = filename;
    this.storedFilename = storedFilename;
    this.size = size;
    this.mimetype = mimetype;
    this.path = path;
    this.createdAt = createdAt || new Date().toISOString();
    this.summary = summary || '';
  }
}