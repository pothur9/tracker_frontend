const PageContent = require("../models/pageContent.model");

exports.createContent = async (req, res) => {
  try {
    const {
      content,
      title,
      image,
      description,
      metatitle,
      metadescription,
      slug,
      pageId,
      isActive,
    } = req.body;

    if (!content || !title) {
      return res
        .status(400)
        .json({ message: "Content and Title are required" });
    }

    const newContent = new PageContent({
      content,
      title,
      image,
      description,
      metatitle,
      metadescription,
      slug,
      pageId,
      isActive,
    });

    await newContent.save();

    return res
      .status(200)
      .json({ message: "Content created successfully", content: newContent });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

exports.updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      content,
      title,
      image,
      description,
      metatitle,

      metadescription,
      slug,
      pageId,
      isActive,
    } = req.body;

    const existingContent = await PageContent.findById(id);
    if (!existingContent) {
      return res.status(404).json({ message: "Content not found" });
    }
    existingContent.content = content || existingContent.content;
    existingContent.title = title || existingContent.title;
    existingContent.image = image || existingContent.image;
    existingContent.description = description || existingContent.description;
    existingContent.metatitle = metatitle || existingContent.metatitle;
    existingContent.metadescription =
      metadescription || existingContent.metadescription;
    existingContent.slug = slug || existingContent.slug;
    existingContent.pageId = pageId || existingContent.pageId;
    if (isActive !== undefined) {
      existingContent.isActive = isActive;
    }

    await existingContent.save();
    return res.status(200).json({
      message: "Content updated successfully",
      content: existingContent,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

exports.deleteContent = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await PageContent.findById(id);
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    await PageContent.findByIdAndDelete(id);
    return res.status(200).json({ message: "Content deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

exports.getAllContentByPageId = async (req, res) => {
  try {
    const { pageId } = req.params;
    const contents = await PageContent.find({ pageId });
    return res.status(200).json({ contents });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

exports.getContentById = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await PageContent.findById(id);
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    return res.status(200).json({ content });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};
