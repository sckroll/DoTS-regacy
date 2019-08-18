const mongoose = require("mongoose");

// 개인 크롤링 데이터 스키마 정의
const crawledDataSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    userName: { type: String },
    // keyword: {type: String, required: true, index: 'hashed'},
    // sub_keyword: {type: [String]},
    url: { type: String, required: true },
    level: { type: Number },
    paths: { type: [String] }
    // ref_url: {type: String}
  },
  {
    timestamps: true
  }
);

// Create new document
crawledDataSchema.statics.create = function(payload) {
  const todo = new this(payload);
  return todo.save();
};

// Find all
crawledDataSchema.statics.findAll = function() {
  return this.find({});
};

// Find one by url
crawledDataSchema.statics.findOneByUrl = function(url) {
  return this.findOne({ url });
};

// Find all by level
crawledDataSchema.statics.findAllByLevel = function(level) {
  return this.find({ level });
};

// Update by url
crawledDataSchema.statics.updateByUrl = function(url, payload) {
  // { new: true }: return the modified document rather than the original. Defaults to false.
  return this.findOneAndUpdate({ url }, payload, { new: true });
};

// Delete by url
crawledDataSchema.statics.deleteByUrl = function(url) {
  return this.remove({ url });
};

module.exports = mongoose.model(
  "CrawledData",
  crawledDataSchema,
  "crawled_data"
);
// module.exports = mongoose.model("Amazon_tb", crawledDataSchema, "amazon_tb");
