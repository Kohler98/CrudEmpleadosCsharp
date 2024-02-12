const _modeloEmpleado = {
    idEmpleado: 0,
    nombreCompleto: "",
    idDepartamento: 0,
    sueldo: 0,
    fechaContrato:""
}

function MostrarEmpleados() {
    fetch("/Home/listaEmpleado")
        .then(resp => {


            return resp.ok ? resp.json() : Promise.reject(resp)
        })
        .then(respJson=> {
            if (respJson.length >= 0) {
                $("#tablaEmpleado tbody").html("");

                respJson.forEach((empleado) => {

                    $("#tablaEmpleado tbody").append(
                        $("<tr>").append(
                            $("<td>").text(empleado.nombreCompleto),
                            $("<td>").text(empleado.refDepartamento.nombre),
                            $("<td>").text(empleado.sueldo),
                            $("<td>").text(empleado.fechaContrato),
                            $("<td>").append(
                                $("<button>")
                                    .addClass("btn btn-primary btn-sm boton-editar-empleado")
                                    .text("Editar")
                                    .attr("data-empleado", JSON.stringify(empleado)),
                                $("<button>")
                                    .addClass("btn btn-danger btn-sm ms-2 boton-eliminar-empleado")
                                    .text("Eliminar")
                                    .attr("data-empleado", JSON.stringify(empleado))
                            
                            )
                        )
                    )
                });
            }
        })
}
document.addEventListener("DOMContentLoaded", function () {
    MostrarEmpleados()
    fetch("/Home/listaDepartamentos")
        .then(resp => {

            return resp.ok ? resp.json() : Promise.reject(resp)
        })
        .then(respJson => {
            if (respJson.length > 0) {
                respJson.forEach((item) => {
                    $("#cboDepartamento").append(
                        $("<option>").val(item.idDepartamento).text(item.nombre)
                    )
                })
            }
        })

    $("#txtFechaContrato").datepicker({
        format: "dd/mm/yyyy",
        autoclose: true,
        todayHighlight:true
    })

}, false)

function MostrarModal() {
    $("#txtNombreCompleto").val(_modeloEmpleado.nombreCompleto);
    $("#cboDepartamento").val(_modeloEmpleado.idDepartamento == 0 ? $("#cboDepartamento option:first").val() : _modeloEmpleado.idDepartamento);
    $("#txtSueldo").val(_modeloEmpleado.sueldo);
    $("#txtFechaContrato").val(_modeloEmpleado.fechaContrato);

    $("#modalEmpleado").modal("show");
}
$(document).on("click", ".boton-nuevo-empleado", () => {
 
    _modeloEmpleado.idEmpleado = 0;
    _modeloEmpleado.nombreCompleto = "";
    _modeloEmpleado.idDepartamento = 0;
    _modeloEmpleado.sueldo = 0;
    _modeloEmpleado.fechaContrato = "";

    MostrarModal();
})
 
$(document).on("click", ".boton-editar-empleado", (e) => {

 
    const _empleado = JSON.parse(e.target.dataset.empleado);
 
    _modeloEmpleado.idEmpleado = _empleado.idEmpleado;
    _modeloEmpleado.nombreCompleto = _empleado.nombreCompleto;
    _modeloEmpleado.idDepartamento = _empleado.refDepartamento.idDepartamento;
    _modeloEmpleado.sueldo = _empleado.sueldo;
    _modeloEmpleado.fechaContrato = _empleado.fechaContrato;

    MostrarModal();
})
$(document).on("click", ".boton-guardar-cambios-empleados", () => {
    const modelo = {
        idEmpleado: _modeloEmpleado.idEmpleado,
        nombreCompleto: $("#txtNombreCompleto").val(),
        refDepartamento: {
            idDepartamento: $("#cboDepartamento").val()
        },
        sueldo: $("#txtSueldo").val(),
        fechaContrato: $("#txtFechaContrato").val()
    }

    if (_modeloEmpleado.idEmpleado == 0) {
        fetch("/Home/guardarEmpleado", {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify(modelo)
        })
            .then(resp => {
                console.log(resp)
                return resp.ok ? resp.json() : Promise.reject(resp)
            })
            .then(respJson => {
                if (respJson.valor) {
                    $("#modalEmpleado").modal("hide")
                    Swal.fire("Listo", "Empleado fue creado", "success")
                    MostrarEmpleados()
                } else {
                    Swal.fire("Lo sentimos", "No se pudo crear el empleado", "error")
                }
            })
    } else {
        fetch("/Home/editarEmpleado", {
            method: "PUT",
            headers: { "Content-Type": "application/json;charset=utf-8" },
            body: JSON.stringify(modelo)
        })
            .then(resp => {
 
                return resp.ok ? resp.json() : Promise.reject(resp)
            })
            .then(respJson => {
                if (respJson.valor) {
                    $("#modalEmpleado").modal("hide")
                    Swal.fire("Listo", "Empleado fue actualizado", "success")
                    MostrarEmpleados()
                } else {
                    Swal.fire("Lo sentimos", "No se pudo actualizar el empleado", "error")
                }
            })
    }  
})

$(document).on("click", ".boton-eliminar-empleado", (e) => {
    const _empleado = JSON.parse(e.target.dataset.empleado);

    Swal.fire({
        title: "Esta seguro?",
        text: `Eliminar empleado "${_empleado.nombreCompleto}"`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, Eliminar",
        cancelButtonText:"No, volver"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/Home/eliminarEmpleado?idEmpleado=${_empleado.idEmpleado}`, {
                method: "DELETE",

            })
                .then(resp => {
                    console.log(resp)
                    return resp.ok ? resp.json() : Promise.reject(resp)
                })
                .then(respJson => {
                    if (respJson.valor) {
                        Swal.fire("Listo", "Empleado fue eliminado", "success")
                        MostrarEmpleados()
                    } else {
                        Swal.fire("Lo sentimos", "No se pudo eliminar el empleado", "error")
                    }
                })
        }
    })
})