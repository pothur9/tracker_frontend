const ContentPage = require("../models/contentPage.model");
const PageContent = require("../models/pageContent.model");

exports.createPage = async (req, res) => {
  try {
    const {
      routeId,
      pageTitle,
      pageDescription,
      pageLayout,

      isActive,
    } = req.body;

    if (!routeId || !pageTitle) {
      return res
        .status(400)
        .json({ message: "routeId and pageTitle are required" });
    }

    const newPage = new ContentPage({
      routeId,
      pageTitle,
      pageDescription,
      pageLayout,

      isActive,
    });

    await newPage.save();

    return res
      .status(200)
      .json({ message: "Page created successfully", page: newPage });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

exports.deletePage = async (req, res) => {
  try {
    const { id } = req.params;

    const page = await ContentPage.findById(id);
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    await ContentPage.findByIdAndDelete(id);

    return res.status(200).json({ message: "Page deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

exports.updatePage = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      routeId,
      pageTitle,
      pageDescription,
      pageLayout,

      isActive,
    } = req.body;

    const page = await ContentPage.findById(id);
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    page.routeId = routeId || page.routeId;
    page.pageTitle = pageTitle || page.pageTitle;
    page.pageDescription = pageDescription || page.pageDescription;
    page.pageLayout = pageLayout || page.pageLayout;
    page.isActive = isActive !== undefined ? isActive : page.isActive;

    await page.save();

    return res.status(200).json({ message: "Page updated successfully", page });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

exports.getAllPages = async (req, res) => {
  try {
    const pages = await ContentPage.find();
    return res.status(200).json({ pages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

exports.getPageByRouteId = async (req, res) => {
  try {
    const { routeId } = req.params;

    const page = await ContentPage.findOne({ routeId }).populate("pageContent");

    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    return res.status(200).json({ page });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};
