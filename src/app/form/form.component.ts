import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { dataForm } from './T';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgFor,
    NgIf
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})

export class FormComponent {
  protected form!: FormGroup;
  protected currentTab: number = 0;
  
  constructor(private formBuildService: FormBuilder) {
    this.form = this.formBuildService.group({
      identificacao: this.formBuildService.group({
        nome: ['', Validators.required],
        codigoRegiao: ['', Validators.required]
      }),

      endereco: this.formBuildService.group({
        rua: ['', Validators.required],
        cidade: ['', Validators.required],
        estado: ['', Validators.required],
        cep: ['', Validators.required]
      }),

      conta: this.formBuildService.array([]),

      telefone: this.formBuildService.array([])
    });

    this.insertingData(dataForm);
  }

  get telefone() {
    return this.form.get('telefone') as FormArray;
  }

  get conta() {
    return this.form.get("conta") as FormArray;
  }

  public addTelefone(): void {
    const setTelefone = this.formBuildService.group({
      ddd: ['', Validators.required],
      numeroTelefone: ['', Validators.required]
    })
    this.telefone.push(setTelefone);
  }

  public removeTelefone(index: number): void {
    this.telefone.removeAt(index);
  }

  public nextTab(): void {
    this.currentTab++;
  }

  public prevTab(): void {
    this.currentTab--;
  }

  addConta() {
    const contaForm = this.formBuildService.group({
      agencia: ['', Validators.required],
      numero: ['', Validators.required],
      tipoConta: ['', Validators.required],
      nomeBanco: ['', Validators.required],
      transacoes: this.formBuildService.array([])  // Lista de transações para cada conta
    });

    this.conta.push(contaForm);
  }

  public removeConta(index: number) {
    this.conta.removeAt(index);
  }

  // Método para adicionar uma nova transação a uma conta específica
  public addTransacao(contaIndex: number) {
    const transacaoForm = this.formBuildService.group({
      valor: ['', Validators.required],
      data: ['', Validators.required]
    });

    const transacoes = this.conta.at(contaIndex).get('transacoes') as FormArray;
    transacoes.push(transacaoForm);
  }

  // Método para remover uma transação de uma conta específica
  public removeTransacao(contaIndex: number, transacaoIndex: number) {
    const transacoes = this.conta.at(contaIndex).get('transacoes') as FormArray;
    transacoes.removeAt(transacaoIndex);
  }

  getContasControls(): FormGroup[] {
    return (this.form.get('conta') as FormArray).controls as FormGroup[];
  }
  
  getTransacoesControls(contaGroup: FormGroup): FormGroup[] {
    return (contaGroup.get('transacoes') as FormArray).controls as FormGroup[];
  }

  public isGroupValidAndFilled(group: FormGroup): boolean {
    return Object.keys(group.controls).every(controlName => {
      const control = group.get(controlName);
      return control && control.valid && control.value !== '';
    });
  }

  public isFormArrayValidAndFilled(array: FormArray): boolean {
    if (array.length === 0) {
      return false;
    }
    for (let control of array.controls) {
      if (control.invalid) {
        return false;
      }
    }
    return true;
  }

  public isCurrentTabValid(): boolean {
    switch(this.currentTab) {
      case 0:
        return this.isGroupValidAndFilled(this.form.get('identificacao') as FormGroup);
      case 1:
        return this.isGroupValidAndFilled(this.form.get('endereco') as FormGroup);
      case 2: 
        return this.isGroupValidAndFilled(this.form.get('conta') as FormGroup);
      case 3:
        return this.isFormArrayValidAndFilled(this.telefone);
      default:
        return false;
    }
  }

  public hasErrorInTab(tabIndex: number): boolean {
    switch(tabIndex) {
      case 0:
        return !this.isGroupValidAndFilled(this.form.get('identificacao') as FormGroup);
      case 1:
        return !this.isGroupValidAndFilled(this.form.get('endereco') as FormGroup);
      case 2: 
        return !this.isGroupValidAndFilled(this.form.get('conta') as FormGroup);
      case 3:
        return !this.isFormArrayValidAndFilled(this.telefone);
      default:
        return false;
    }
  }

  public insertingData(dataForm: any): void {
    // Atualiza os dados principais
    this.form.patchValue({
      identificacao: dataForm.identificacao,
      endereco: dataForm.endereco
    });

    // Limpa e adiciona os dados das contas
    const contaArray = this.form.get('conta') as FormArray;
    contaArray.clear();
    dataForm.conta.forEach((conta: any) => {
      const contaForm = this.formBuildService.group({
        agencia: [conta.agencia, Validators.required],
        numero: [conta.numero, Validators.required],
        tipoConta: [conta.tipoConta, Validators.required],
        nomeBanco: [conta.nomeBanco, Validators.required],
        transacoes: this.formBuildService.array([])
      });

      conta.transacoes.forEach((transacao: any) => {
        (contaForm.get('transacoes') as FormArray).push(this.formBuildService.group(transacao));
      });

      contaArray.push(contaForm);
    });

    // Limpa e adiciona os dados dos telefones
    const telefoneArray = this.form.get('telefone') as FormArray;
    telefoneArray.clear();
    dataForm.telefone.forEach((tel: any) => {
      telefoneArray.push(this.formBuildService.group(tel));
    });
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      return;
    } 

    console.log(this.form.value);

    this.form.reset();
  }
}
