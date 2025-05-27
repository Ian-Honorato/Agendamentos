import Sequelize, { DataTypes, Model } from "sequelize";
import bcrypt from "bcryptjs";
import Carteira from "./Carteira";

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
    this.addHook("afterCreate", async (user) =>{
      await Carteira.create({
        user_id: user.id,
        moedas: 30,
      })
    })


    return this;
  }
  passwordIsValid(password) {
    return bcrypt.compare(password, this.senha);
  }

  static associate(models) {
    this.hasOne(models.Carteira, {
      foreignKey: "user_id",
      as: "carteira",
    })
    this.hasMany(models.Contato, {
      foreignKey: "usuario_id",
      as: "contatos",
    });
    this.hasMany(models.Conversa,{
      foreignKey: "user_remetente",
      as: "mensagemEnviada",
    })
    this.hasMany(models.Conversa,{
      foreignKey: "user_destinatario",
      as:"mensagemRecebida",
    });
    this.hasMany(models.Produto,{
      foreignKey: "user_id",
      as:"produto",
    })
  }
}
