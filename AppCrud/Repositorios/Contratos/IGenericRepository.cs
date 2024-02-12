namespace AppCrud.Repositorios.Contratos
{
    public interface IGenericRepository<T>where T : class
    {
        Task<List<T>> Lista();
        Task<bool> Save(T modelo);
        Task<bool> Edit(T modelo);
        Task<bool> Delete(int id);
    }
}
