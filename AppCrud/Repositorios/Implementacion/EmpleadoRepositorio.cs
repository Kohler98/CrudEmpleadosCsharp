using AppCrud.Models;
using AppCrud.Repositorios.Contratos;
using System.Data;
using System.Data.SqlClient;
using System.Reflection;

namespace AppCrud.Repositorios.Implementacion
{
    public class EmpleadoRepository : IGenericRepository<Empleado>
    {

        private readonly string _cadenaSql = "";

        public EmpleadoRepository(IConfiguration configuracion)
        {
            _cadenaSql = configuracion.GetConnectionString("cadenaSQL");
        }
        public async Task<List<Empleado>> Lista()
        {
            List<Empleado> _lista = new List<Empleado>();

            using (var conexion = new SqlConnection(_cadenaSql))
            {
                conexion.Open();
                SqlCommand cmd = new SqlCommand("sp_ListadoEmpleados", conexion);
                cmd.CommandType = CommandType.StoredProcedure;
                using (var dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        _lista.Add(new Empleado
                        {
                            idEmpleado = Convert.ToInt32(dr["idEmpleado"]),
                            nombreCompleto = dr["nombreCompleto"].ToString(),
                            refDepartamento = new Departamento()
                            {
                                idDepartamento = Convert.ToInt32(dr["idDepartamento"]),
                                nombre = dr["nombre"].ToString()
                            },
                            sueldo = Convert.ToInt32(dr["sueldo"]),
                            fechaContrato = dr["fechaContrato"].ToString(),
                        });
                    }
                }
            }
            return _lista;
        }

        public async Task<bool> Save(Empleado modelo)
        {
            using (var conexion = new SqlConnection(_cadenaSql))
            {
                conexion.Open();
                SqlCommand cmd = new SqlCommand("sp_GuardarEmpleado", conexion);
                cmd.Parameters.AddWithValue("nombreCompleto",modelo.nombreCompleto);
                cmd.Parameters.AddWithValue("idDepartamento", modelo.refDepartamento.idDepartamento);
                cmd.Parameters.AddWithValue("sueldo",modelo.sueldo);
                cmd.Parameters.AddWithValue("fechaContrato", modelo.fechaContrato);

                cmd.CommandType = CommandType.StoredProcedure;

                int filas_afectados = await cmd.ExecuteNonQueryAsync();
                if(filas_afectados > 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }
        public async Task<bool> Delete(int id)
        {
            using (var conexion = new SqlConnection(_cadenaSql))
            {
                conexion.Open();
                SqlCommand cmd = new SqlCommand("sp_EditarEmpleado", conexion);
                cmd.Parameters.AddWithValue("idEmpleado", id);


                cmd.CommandType = CommandType.StoredProcedure;

                int filas_afectados = await cmd.ExecuteNonQueryAsync();
                if (filas_afectados > 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }


        public async Task<bool> Edit(Empleado modelo)
        {
            using (var conexion = new SqlConnection(_cadenaSql))
            {
                conexion.Open();
                SqlCommand cmd = new SqlCommand("sp_EditarEmpleado", conexion);
                cmd.Parameters.AddWithValue("idEmpleado", modelo.idEmpleado);
                cmd.Parameters.AddWithValue("nombreCompleto", modelo.nombreCompleto);
                cmd.Parameters.AddWithValue("idDepartamento", modelo.refDepartamento.idDepartamento);
                cmd.Parameters.AddWithValue("sueldo", modelo.sueldo);
                cmd.Parameters.AddWithValue("fechaContrato", modelo.fechaContrato);

                cmd.CommandType = CommandType.StoredProcedure;

                int filas_afectados = await cmd.ExecuteNonQueryAsync();
                if (filas_afectados > 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }
    }
}
