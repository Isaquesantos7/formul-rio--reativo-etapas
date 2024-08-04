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

      conta: this.formBuildService.group({
        agencia: ['', Validators.required],
        numero: ['', Validators.required],
        tipoConta: ['', Validators.required],
        nomeBanco: ['', Validators.required]
      }),

      telefone: this.formBuildService.array([])
    });

    this.insertingData(dataForm);
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

  public isGroupValidAndFilled(group: FormGroup): boolean {
    for (let control in group.controls) {
      if (group.controls[control].invalid || group.controls[control].value === '') {
        return false;
      }
    }
    return true;
  }

  public isFormArrayValidAndFilled(array: FormArray): boolean {
    if (array.length === 0) {
      return false;
    }
    for (let control of array.controls) {
      if (control.invalid || control.value.tipo === '' || control.value.numero === '') {
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

  public insertingData(data: any): void {
    this.form.patchValue(data);

    /*
      Case was list.
    */
    this.telefone.clear();
    data.telefone.forEach((tel: any) => {
      this.telefone.push(this.formBuildService.group(tel));
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
