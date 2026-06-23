import { json } from "body-parser";
import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const data = { ...req.body };
    data.name = JSON.parse(data.name);
    data.description = JSON.parse(data.description);

    const product = await Product.create({
      ...data,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updatedData = { ...req.body };
    updatedData.name = JSON.parse(updatedData.name);
    updatedData.description = JSON.parse(updatedData.description);

    if (req.file) {
      updatedData.image = `/uploads/${req.file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
