import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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

      conta: this.formBuildService.group({
        agencia: ['', Validators.required],
        numero: ['', Validators.required],
        tipoConta: ['', Validators.required],
        nomeBanco: ['', Validators.required]
      }),

      telefone: this.formBuildService.array([])
    })
  }

  get telefone() {
    return this.form.get('telefone') as FormArray;
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

  public onSubmit(): void {
    if (this.form.invalid) {
      return;
    } 

    console.log(this.form.value);

    this.form.reset();
  }
}
