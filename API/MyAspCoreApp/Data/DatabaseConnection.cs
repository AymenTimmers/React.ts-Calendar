using Microsoft.Data.Sqlite;
using Dapper;
using MyBackend.interfaces;

public class DatabaseService : IDatabaseService
{
    private string _path = "Data Source=database.db";
    
    private SqliteConnection GetConnection()
    {
        return new SqliteConnection(_path);
    }

    public async Task<T> QuerySingleAsync<T>(string query, object? values = null)
    {
        using var conn = GetConnection();
        return conn.QuerySingle<T>(query, values);
    }

    public async Task<T?> QueryFirstOrDefaultAsync<T>(string query, object? values = null)
    {
        using var conn = GetConnection();
        return conn.QueryFirstOrDefault<T>(query, values);
    }

    public async Task ExecuteAsync(string query, object? values = null)
    {
        using var conn = GetConnection();
        conn.Execute(query, values);
    }
    
    public async Task<List<T>> QueryListAsync<T>(string query, object? values = null)
    {
        using var conn = GetConnection();
        return conn.Query<T>(query, values).ToList();
    }
}