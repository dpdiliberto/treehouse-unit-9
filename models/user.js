'use strict';
const bcrypt = require('bcrypt');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Course, {
        foreignKey: {
          name: 'userId'
        }
      })
    }
  };
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A first name is required.'
        },
        notEmpty: {
          msg: 'Please provide a first name.'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A last name is required.'
        },
        notEmpty: {
          msg: 'Please provide a last name.'
        }
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'An email address is required.'
        },
        notEmpty: {
          msg: 'Please provide an email address.'
        },
        isEmail: {
          msg: 'Please provide a valid email address'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A password is required.'
        },
        notEmpty: {
          msg: 'Please provide a password.'
        }
      },
      set(val) {
        const hashedPassword = bcrypt.hashSync(val, 10);
        this.setDataValue('password', hashedPassword);
      }
    }
  }, {
    sequelize,
    timestamps: false,
    modelName: 'User',
  });
  return User;
};