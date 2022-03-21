const db = require('../models');
const { unlink } = require('fs');

const Photo = db.photos;
const Product = db.products;

const addPhoto = async (req, res) => {
  let productId = req.body.product_id;
  if (!productId) {
    return res.status(400).json({ msg: 'Please provide product_id' })
  };

  const checkProductExist = await Product.findOne({
    where: { id: productId },
  });

  if (!checkProductExist) {
    return res.status(400).json({ msg: 'Unable to find provided product_id' });
  } else {
    let photoDetails = {
      product_id: productId,
      url: `${req.file.path}`,
      active: true,
      main_photo: false,
    };
    let photo = await Photo.create(photoDetails).catch((err) => {
      console.log('Error' + err);
    });
    res.status(200).send(photo);
  }
};
const getAllPhotos = async (req, res) => {
  const photos = await Photo.findAll({});
  res.status(200).send(photos);
};

const getPhotoById = async (req, res) => {
  const id = req.params.id;
  const photo = await Photo.findOne({ where: { id: id } });
  res.status(200).send(photo);
};

const updatePhotoById = async (req, res) => {
  const id = req.params.id;
  const photo = await Photo.update(req.body, { where: { id: id } });
  res.status(200).send(photo);
};

const deletePhotoById = async (req, res) => {
  const id = req.params.id;
  let { url } = await Photo.findOne({ where: { id: id }});
  unlink(`./${url}`, (err) => {
    if (err) throw err;
  });
  await Photo.destroy({ where: { id: id } });
  res.status(200).json({ msg: `Photo & record deleted`})
};

const removeAllPhotosByProductId = async (req, res) => {
  const id = req.params.id;
  let allPhotosByProductId = await Photo.findAll({ where: { product_id: id }});
  for (const file of allPhotosByProductId) {
    unlink(`./${file.url}`, (err) => {
      if (err) throw err
    });
  }
  await Photo.destroy({ where: { product_id: id } });
  res.status(200).json({ msg: `Photos & record deleted`})
};

const getAllPhotosByProductId = async (req, res) => {
  const id = req.params.id;
  const photos = await Photo.findAll({ where: { product_id: id } });
  res.status(200).send(photos);
};

const getMainPhotoByProductId = async (req, res) => {
  const id = req.params.id;
  const photo = await Photo.findOne({
    where: { product_id: id, main_photo: true },
  });
  res.status(200).send(photo);
};

module.exports = {
  addPhoto,
  getAllPhotos,
  getAllPhotosByProductId,
  getMainPhotoByProductId,
  getPhotoById,
  updatePhotoById,
  deletePhotoById,
  removeAllPhotosByProductId,
};
