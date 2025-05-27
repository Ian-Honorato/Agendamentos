import Sequelize, { DataTypes, Model } from "sequelize";


export default class Mensagem extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        content: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            len: {
              args: [1, 300],
              msg: "O número deve ter entre 1 e 300 caracteres",
            },
          },
        },
        read: {
            type: DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue: false
        },
        conversa_id: {
            type: DataTypes.INTEGER,
            allowNull:false
        },
        id_usuario:{
          type:DataTypes.INTEGER,
          allowNull:false
        }
      },
      {
        sequelize,
        tableName: "mensagens",
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Conversa, {
      foreignKey: "conversa_id",
      as: "conversa",
    });
  }
}
