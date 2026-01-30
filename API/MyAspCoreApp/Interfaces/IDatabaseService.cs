namespace MyBackend.interfaces;

public interface IDatabaseService
{
    public Task<T> QuerySingleAsync<T>(string query, object? values = null);
    public Task<T?> QueryFirstOrDefaultAsync<T>(string query, object? values = null);
    public Task<List<T>> QueryListAsync<T>(string query, object? values = null);
    public Task ExecuteAsync(string query, object? values = null);
}