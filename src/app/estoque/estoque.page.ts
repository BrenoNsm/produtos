import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-estoque',
  templateUrl: './estoque.page.html',
  styleUrls: ['./estoque.page.scss'],
})
export class EstoquePage implements OnInit {
  
  meusDados: any = [];
  novoProduto: any = { nome_produto: '', preco: '', quantidade: '' };

  constructor(private http: HttpClient, private alertController: AlertController) { }

  ngOnInit() {
    this.dadosAPI();
  }

  dadosAPI() {
    this.http.get('http://localhost:3000/').subscribe(
      (resposta: any) => {
        this.meusDados = resposta.dados;
      }
    );
  }

  async exibirAlertaAdicionarProduto() {
    const alert = await this.alertController.create({
      header: 'Adicionar Produto',
      inputs: [
        {
          name: 'nome_produto',
          type: 'text',
          placeholder: 'Nome do Produto'
        },
        {
          name: 'preco',
          type: 'number',
          placeholder: 'Preço'
        },
        {
          name: 'quantidade',
          type: 'number',
          placeholder: 'Quantidade'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Adicionar',
          handler: (data) => {
            this.novoProduto = data;
            this.adicionarProduto();
          }
        }
      ]
    });

    await alert.present();
  }

  adicionarProduto() {
    const params = new HttpParams()
      .set('nome_produto', this.novoProduto.nome_produto)
      .set('preco', this.novoProduto.preco)
      .set('quantidade', this.novoProduto.quantidade);

    this.http.post('http://localhost:3000/inserirproduto', null, { params }).subscribe(
      (resposta: any) => {
        console.log('Produto inserido com sucesso');
        this.dadosAPI(); // Recarrega os dados após a inserção
      },
      (erro) => {
        console.error('Erro ao inserir produto', erro);
      }
    );
  }

  async exibirAlertaEditarProduto(dado: any) {
    const alert = await this.alertController.create({
      header: 'Editar Produto',
      inputs: [
        {
          name: 'nome_produto',
          type: 'text',
          value: dado.nome_produto,
          placeholder: 'Nome do Produto'
        },
        {
          name: 'preco',
          type: 'number',
          value: dado.preco,
          placeholder: 'Preço'
        },
        {
          name: 'quantidade',
          type: 'number',
          value: dado.quantidade,
          placeholder: 'Quantidade'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Salvar',
          handler: (data) => {
            this.editarProduto(dado.id, data);
          }
        }
      ]
    });

    await alert.present();
  }

  editarProduto(id: number, novoProduto: any) {
    const params = new HttpParams()
      .set('nome_produto', novoProduto.nome_produto)
      .set('preco', novoProduto.preco)
      .set('quantidade', novoProduto.quantidade);
  
    this.http.put(`http://localhost:3000/atualizarproduto/${id}`, null, { params }).subscribe(
      (resposta: any) => {
        console.log('Produto atualizado com sucesso');
        this.dadosAPI(); // Recarrega os dados após a atualização
      },
      (erro) => {
        console.error('Erro ao atualizar produto', erro);
      }
    );
  }
  

  async exibirAlertaExcluirProduto(dado: any) {
    const alert = await this.alertController.create({
      header: 'Excluir Produto',
      message: `Tem certeza que deseja excluir o produto ${dado.nome_produto}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.excluirProduto(dado.id);
          }
        }
      ]
    });

    await alert.present();
} 

excluirProduto(id: number) {
    this.http.delete(`http://localhost:3000/deletaruser/${id}`).subscribe(
      (resposta: any) => {
        console.log('Produto excluído com sucesso');
        this.dadosAPI(); // Recarrega os dados após a exclusão
      },
      (erro) => {
        console.error('Erro ao excluir produto', erro);
      }
    );
}

  
}
