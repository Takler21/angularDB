import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../Service/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { IDepartment } from '../Models/department';
import { DBOperation } from '../Shared/enum';
import { Observable } from 'rxjs/Rx';
import { Global } from '../Shared/global';

@Component({

    templateUrl: 'app/Components/department.component.html'

})

export class DepartmentComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    departments: IDepartment[];
    //La variable de abajo sirve como indicador, para decirnos cual modificar.
    department: IDepartment;
    msg: string;
    msg2: string;
    empl: any[] = [];
    indLoading: boolean = false;
    departmentFrm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;

    constructor(private fb: FormBuilder, private _userService: UserService) { }

    ngOnInit(): void {

        this.departmentFrm = this.fb.group({
            Id: [''],
            NameDepart: ['', Validators.required],
            Sales: [''],

        });

        this.LoadDeparts();


        this.LoadUsers();

    }

    LoadDeparts(): void {
        this.indLoading = true;
        this._userService.get(Global.BASE_DEPART_ENDPOINT)
            //tal vez prodria hacer the department u user fueran valores del servicio.
            .subscribe(departments => { this.departments = departments; this.indLoading = false; },
            error => this.msg = <any>error);

    }

    LoadUsers(): void {
        this._userService.get(Global.BASE_USER_ENDPOINT)
            .subscribe(users => {
                users.forEach((key: any) => {
                    this.empl[key['Id_Depart']] = key['Id_Depart'];
                })
            },
            error => this.msg = <any>error);

    }

    addDepart() {
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Nuevo Departamento";
        this.modalBtnTitle = "Agregar";
        this.departmentFrm.reset();
        this.modal.open();
    }

    editDepart(id: number) {
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Editar Departamento";
        this.modalBtnTitle = "Actualizar";
        this.department = this.departments.filter(x => x.Id == id)[0];
        this.departmentFrm.setValue(this.department);
        this.modal.open();
    }

    deleteDepart(id: number) {
        if (!this.empl[id]) {
            this.dbops = DBOperation.delete;
            this.SetControlsState(false);
            this.modalTitle = "Borrar?";
            this.modalBtnTitle = "Borrar";
            this.department = this.departments.filter(x => x.Id == id)[0];
            this.departmentFrm.setValue(this.department);
            this.modal.open();
        }
        else
            this.msg = "El departamento no puede borrarse mientras haya usuarios asignados a este."
    }

    SetControlsState(isEnable: boolean) {
        isEnable ? this.departmentFrm.enable() : this.departmentFrm.disable();
    }

    onSubmit(formData: any) {
        this.msg = "";
        this.msg2 = "";

        let vr: boolean = true;

        this.departments.forEach(key => {
            if (formData._value.NameDepart.toUpperCase().trim() == key['NameDepart'].toUpperCase().trim())
                if (key['Id'] != formData._value.Id)
                    vr = false;
        })

        if (vr) {
            if (formData._value.Sales == null)
                formData._value.Sales = 0;
            switch (this.dbops) {
                case DBOperation.create:
                    this._userService.post(Global.BASE_DEPART_ENDPOINT, formData._value).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                this.msg = "Departamento añadido correctamente.";
                                this.LoadDeparts();
                            }
                            else {
                                this.msg = "Hay problemas para guardar los datos!"
                            }

                            this.modal.dismiss();
                        },
                        error => {
                            this.msg = error;
                        }
                    );
                    break;
                case DBOperation.update:
                    this._userService.put(Global.BASE_DEPART_ENDPOINT, formData._value.Id, formData._value).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                this.msg = "El departamento se ha actualizado exitosamente.";
                                this.LoadDeparts();
                            }
                            else {
                                this.msg = "Hay problemas para guardar los datos!"
                            }

                            this.modal.dismiss();
                        },
                        error => {
                            this.msg = error;
                        }
                    );
                    break;
                case DBOperation.delete:
                    this._userService.delete(Global.BASE_DEPART_ENDPOINT, formData._value.Id).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                this.msg = "El departamento se ha borrado exitosamente.";
                                this.LoadDeparts();
                            }
                            else {
                                this.msg = "Hay problemas al guardar las modificaciones hechas!"
                            }

                            this.modal.dismiss();
                        },
                        error => {
                            this.msg = error;
                        }
                    );
                    break;

            }
        }
        else
            this.msg2 = "Ese departamento ya existe, por favor, escoja otro nombre"
    }

}