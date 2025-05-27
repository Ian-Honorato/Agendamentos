import Sequelize, { DataTypes, Model } from "sequelize";


export default class Conversa extends Model {
  static init(sequelize) {
    super.init(
      {
        user_remetente:{
            type: DataTypes.INTEGER,
            allowNull:false,

        },
        user_destinatario:{
            type: DataTypes.INTEGER,
            allowNull:false,
            
        },
        
      },
      {
        sequelize,
        tableName: "conversas",
      }
    );

    return this;
  }
  
  static associate(models) {
    this.belongsTo(models.User, {
        foreignKey:"user_remetente",
        as: "remetente"
    });
    this.belongsTo(models.User, {
        foreignKey: "user_destinatario",
        as: "destinatario"
    })
    this.hasMany(models.Mensagem, {
      foreignKey: "conversa_id",
      as: "mensagens",
    })
   
  }
}
