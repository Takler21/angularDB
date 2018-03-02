"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var user_service_1 = require("../Service/user.service");
var forms_1 = require("@angular/forms");
var ng2_bs3_modal_1 = require("ng2-bs3-modal/ng2-bs3-modal");
var enum_1 = require("../Shared/enum");
var global_1 = require("../Shared/global");
var UserComponent = (function () {
    function UserComponent(fb, _userService) {
        this.fb = fb;
        this._userService = _userService;
        this.id_dep = [];
        this.ids = [];
        this.indLoading = false;
        this.prueba = [];
        this.keysID = [];
    }
    UserComponent.prototype.ngOnInit = function () {
        this.userFrm = this.fb.group({
            Id: [''],
            FirstName: ['', forms_1.Validators.required],
            LastName: [''],
            Gender: [''],
            Id_Depart: ['']
        });
        this.LoadUsers();
        //Tal vez el loadIds tenga que ir dentro del loadUsers por usar peticiones asincronas ambas,
        //aunque en principio no deberia tener problema debido a que son independientes.
        this.LoadIds();
    };
    UserComponent.prototype.LoadUsers = function () {
        var _this = this;
        this.indLoading = true;
        this._userService.get(global_1.Global.BASE_USER_ENDPOINT)
            .subscribe(function (users) {
            _this.users = users;
            _this.indLoading = false;
            //tal vez meter aqui el LoadIds()
        }, function (error) { return _this.msg = error; }, function () {
            _this.users.forEach(function (key) {
                if (!_this.id_dep[key['Id_Depart']])
                    _this.id_dep[key['Id_Depart']] = key['Id_Depart'];
            });
        });
    };
    //Para comprobar que el id que se pasa como parametro del departamento exite y evitar el errores.
    UserComponent.prototype.LoadIds = function () {
        var _this = this;
        this._userService.get(global_1.Global.BASE_DEPART_ENDPOINT)
            .subscribe(function (ids) {
            _this.ids = ids;
            _this.ids.forEach(function (key) {
                _this.prueba[key['Id']] = key['Id'];
            });
            _this.keysID = Object.keys(_this.prueba);
        }, function (error) { return _this.msg = error; });
    };
    UserComponent.prototype.addUser = function () {
        this.dbops = enum_1.DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Nuevo Usuario";
        this.modalBtnTitle = "Agregar";
        this.userFrm.reset();
        this.modal.open();
    };
    UserComponent.prototype.editUser = function (id) {
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Editar Usuario";
        this.modalBtnTitle = "Actualizar";
        this.user = this.users.filter(function (x) { return x.Id == id; })[0];
        this.userFrm.setValue(this.user);
        this.modal.open();
    };
    UserComponent.prototype.deleteUser = function (id) {
        this.dbops = enum_1.DBOperation.delete;
        this.SetControlsState(false);
        this.modalTitle = "Borrar?";
        this.modalBtnTitle = "Borrar";
        this.user = this.users.filter(function (x) { return x.Id == id; })[0];
        this.userFrm.setValue(this.user);
        this.modal.open();
    };
    //Activa o desactiva el form modal.
    UserComponent.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.userFrm.enable() : this.userFrm.disable();
    };
    //tal vez meter aqui el LoadIds(), en el onSubmit()
    UserComponent.prototype.onSubmit = function (formData) {
        var _this = this;
        this.msg = "";
        this.msg2 = "";
        if (this.prueba[formData._value.Id_Depart] || formData._value.Id_Depart == "" || formData._value.Id_Depart == null) {
            this.hola = "hola";
            //Comprobacion de IDs
            switch (this.dbops) {
                case enum_1.DBOperation.create:
                    this._userService.post(global_1.Global.BASE_USER_ENDPOINT, formData._value).subscribe(function (data) {
                        //Alternativa!
                        if (data == 1) {
                            _this.msg = "Usuario añadido correctamente.";
                            _this.LoadUsers();
                        }
                        else {
                            _this.msg = "Hay problemas para guardar los datos!";
                        }
                        _this.modal.dismiss();
                    }, function (error) {
                        _this.msg = error;
                    });
                    break;
                case enum_1.DBOperation.update:
                    this._userService.put(global_1.Global.BASE_USER_ENDPOINT, formData._value.Id, formData._value).subscribe(function (data) {
                        if (data == 1) {
                            _this.msg = "El usuario se ha actualizado exitosamente.";
                            _this.LoadUsers();
                        }
                        else {
                            _this.msg = "Hay problemas para guardar los datos!";
                        }
                        _this.modal.dismiss();
                    }, function (error) {
                        _this.msg = error;
                    });
                    break;
                case enum_1.DBOperation.delete:
                    this._userService.delete(global_1.Global.BASE_USER_ENDPOINT, formData._value.Id).subscribe(function (data) {
                        if (data == 1) {
                            _this.msg = "El usuario se ha borrado exitosamente.";
                            _this.LoadUsers();
                        }
                        else {
                            _this.msg = "Hay problemas al guardar las modificaciones hechas!";
                        }
                        _this.modal.dismiss();
                    }, function (error) {
                        _this.msg = error;
                    });
                    break;
            }
        }
        else {
            this.msg2 = "El departamento con esa id no existe";
        }
    };
    __decorate([
        core_1.ViewChild('modal'),
        __metadata("design:type", ng2_bs3_modal_1.ModalComponent)
    ], UserComponent.prototype, "modal", void 0);
    UserComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/Components/user.component.html'
        }),
        __metadata("design:paramtypes", [forms_1.FormBuilder, user_service_1.UserService])
    ], UserComponent);
    return UserComponent;
}());
exports.UserComponent = UserComponent;
//# sourceMappingURL=user.component.js.map