import Sequelize, { DataTypes, Model } from "sequelize";
export default class ProdutoNaTroca extends Model {
    static init(sequelize) {
      super.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        nome_snapshot: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        preco_snapshot: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        quantidade: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        id_produto: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        id_troca: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      }, {
        sequelize,
        tableName: 'produtos_na_troca',
      });
  
      return this;
    }
  
    static associate(models) {
      this.belongsTo(models.Produto, {
        foreignKey: 'id_produto',
        as: 'produto',
        onDelete: 'SET NULL', 
      });
  
      this.belongsTo(models.Troca, {
        foreignKey: 'id_troca',
        as: 'troca',
        onDelete: 'CASCADE',
      });
    }
  }
  