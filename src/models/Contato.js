import Sequelize, { DataTypes, Model } from "sequelize";
import bcrypt from "bcryptjs";

export default class Contato extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        numero: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            len: {
              args: [8, 15],
              msg: "O número deve ter entre 8 e 15 caracteres",
            },
          },
        },
        whatsapp: DataTypes.BOOLEAN,
        usuario_id: DataTypes.INTEGER,
      },
      {
        sequelize,
        tableName: "contatos",
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "usuario_id",
      as: "usuario",
    });
  }
}
