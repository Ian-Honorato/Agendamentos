import Sequelize, { DataTypes, Model } from "sequelize";
import bcrypt from "bcryptjs";

export default class User extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: {
          type: DataTypes.STRING,
          allowNull: false,
          len: {
            args: [2, 50],
            msg: "O nome deve ter entre 2 e 50 caracteres",
          },
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: {
            args: true,
            msg: "O email deve ser unico",
          },
          isEmail: {
            args: true,
            msg: "O email deve ser valido",
          },
        },
        senha: Sequelize.STRING,
        data_nascimento: Sequelize.DATEONLY,
        tipo_usuario: Sequelize.ENUM("admin", "cliente"),
      },
      {
        sequelize,
      },
      this.addHook("beforeSave", async (user) => {
        if (user.senha) {
          const salt = await bcrypt.genSalt(8);
        }
      })
    );
    return this;
  }
}
