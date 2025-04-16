import Sequelize, { DataTypes, Model } from "sequelize";
import bcrypt from "bcryptjs";

export default class User extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            len: {
              args: [2, 250],
              msg: "O nome deve ter entre 2 e 50 caracteres",
            },
          },
        },
        sobrenome: {
          type: DataTypes.STRING,
          validate: {
            len: {
              args: [2, 250],
              msg: "O sobrenome deve ter entre 2 e 50 caracteres",
            },
          },
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: {
            args: true,
            msg: "O email deve ser unico",
          },
          validate: {
            isEmail: {
              args: true,
              msg: "O email deve ser valido",
            },
          },
        },
        senha: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        data_nascimento: Sequelize.DATEONLY,
        tipo_usuario: Sequelize.ENUM("admin", "cliente"),
      },
      {
        sequelize,
      }
    );
    this.addHook("beforeSave", async (user) => {
      if (user.changed("senha")) {
        const salt = await bcrypt.genSalt(8);
        user.senha = await bcrypt.hash(user.senha, salt);
      }
    });

    return this;
  }
  passwordIsValid(password) {
    return bcrypt.compare(password, this.senha);
  }
}
