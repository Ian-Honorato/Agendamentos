import Sequelize, { DataTypes, Model } from "sequelize";


export default class Troca extends Model {
  static init(sequelize) {
    super.init(
      {
        id_troca:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,  
        },
        state: {
            type: DataTypes.ENUM('pendente', 'aceita', 'recusada', 'finalizada'),
            defaultValue: 'pendente',
        },
        data: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        usuario_solicitante_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
           
        },
        usuario_solicitado_id: 
        {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        valor_total:{
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "trocas",
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
        foreignKey: "usuario_solicitante_id",
        as: "solicitante",
      });
      this.belongsTo(models.User, {
        foreignKey: "usuario_solicitado_id",
        as: "solicitado",
      });
      //associação muitos para muitos entre a Troca e Produtos e Produtos_na_troca sendo a tabela intermediaria
      this.belongsToMany(models.Produto, {
        through: "produtos_na_troca",
        foreignKey: "id_troca",
        otherKey: "id_produto",
        as: "produtos",
      });
  }
}
