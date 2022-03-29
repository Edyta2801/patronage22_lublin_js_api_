const CustomAPIError = require('../errors/customError');

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        validate: {
          isIn: {
            args: [['Available', 'Unavailable']],
            msg: 'Status can only be Available or Unavailable'
          }
        }

      },
      quantity: {
        type: DataTypes.INTEGER,
      },
      description: {
        type: DataTypes.TEXT,
      },
      published: {
        type: DataTypes.BOOLEAN,
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at',
      },
    },
    {
      timestamps: true,
    },
  );

  // Product.associate = (models) => {
  //   Product.hasMany(models.Photo, {
  //     foreignKey: 'product_id'
  //   });
  // }

  return Product;
};
