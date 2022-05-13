import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/model/User';
import { AlertasService } from 'src/app/service/alertas.service';
import { AuthService } from 'src/app/service/auth.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  user: User = new User()
  idUser: number
  confirmarSenha: string
  tipoUsuario: string

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private alertas: AlertasService

    ) { }
  
    ngOnInit() {
    window.scroll(0, 0)

    if (environment.token == '') {
      this.router.navigate(['/entrar'])
    }

    this.idUser = this.route.snapshot.params['id']
    this.findByIdUser(this.idUser)
  }

  confirmSenha(event: any) {
    this.confirmarSenha = event.target.value
  }

  validaSenha() {
    let txtSenha = <HTMLLabelElement>document.querySelector('#txtSenha');
    let senha = <HTMLInputElement>document.querySelector('#senha');
    let confSenha = <HTMLInputElement>document.querySelector('#confirmarSenha');

    if (this.confirmarSenha == this.user.senha) {
      txtSenha.innerHTML = 'Confirme sua senha';
      senha.style.border = 'solid 1px green';
      confSenha.style.border = 'solid 1px green';
    } else {
      txtSenha.innerHTML = 'Senhas não são identicas!';
      senha.style.border = 'solid 1px red';
      confSenha.style.border = 'solid 1px red';
    }
  }

  tipoUser(event: any) {
    this.tipoUsuario = event.target.value
  }

  atualizar(){
    this.user.tipo = this.user.tipo;
    if (this.user.senha != this.confirmarSenha) {
      this.alertas.showAlertDanger('As senhas não conferem');
    // if(this.usuario.tipo == null){
    //   alert('Selecione um tipo de usuário antes de prosseguir!')
    // }
    } else {
      this.authService.atualizar(this.user).subscribe({
        next: (resp: User) => {
          this.user = resp;
          this.alertas.showAlertSuccess('Usuario Atualizado com sucesso! Por favor faça o login para validar as alterações');
          this.router.navigate(['/entrar']);
          environment.token = '';
          environment.foto = '';
          environment.id = 0;
          environment.nome = '';
        },
        error: (erro) => {
          if (erro.status == 400) {
            this.alertas.showAlertInfo('Preencha os campos corretamente para atualizar o usuario');
          }
        },
      });
    }

  }

  findByIdUser(id: number) {
    this.authService.getByIdUser(id).subscribe((resp: User) => {
      this.user = resp
    })
  }
}