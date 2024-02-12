using AppCrud.Models;
using AppCrud.Repositorios.Contratos;
using System.Data;
using System.Data.SqlClient;

namespace AppCrud.Repositorios.Implementacion
{
    public class DepartamentoRepository : IGenericRepository<Departamento>
    {
        private readonly string _cadenaSql = "";

        public DepartamentoRepository(IConfiguration configuration)
        {
            _cadenaSql = configuration.GetConnectionString("cadenaSQL");
        }

        public async Task<List<Departamento>> Lista()
        {
            List<Departamento> _lista = new List<Departamento>();

            using (var conexion = new SqlConnection(_cadenaSql))
            {
                conexion.Open();
                SqlCommand cmd = new SqlCommand("sp_ListaDepartamentos", conexion);
                cmd.CommandType = CommandType.StoredProcedure;
                using(var dr=await cmd.ExecuteReaderAsync())
                {
                    while(await dr.ReadAsync())
                    {
                        _lista.Add(new Departamento
                        {
                            idDepartamento = Convert.ToInt32(dr["idDepartamento"]),
                            nombre = dr["nombre"].ToString()
                        });
                    }
                }
            }
            return _lista;
        }
        public Task<bool> Delete(int id)
        {
            throw new NotImplementedException();
        }

        public Task<bool> Edit(Departamento modelo)
        {
            throw new NotImplementedException();
        }


        public Task<bool> Save(Departamento modelo)
        {
            throw new NotImplementedException();
        }
    }
}
