// Spencer Watkinson - Generated with assistance from AI
// FileManager - Handles reading in data from files, used by devices to get their next input value

public class FileManager
{
    private string filePath;
    private FileStream fileStream;
    private StreamReader reader;

    public FileManager(string path)
    {
        if (!Path.IsPathRooted(path))
        {
            path = Path.Combine(AppContext.BaseDirectory, path);
        }

        filePath = Path.GetFullPath(path);

        if (!File.Exists(filePath))
        {
            throw new FileNotFoundException($"Device data file not found: {filePath}");
        }

        fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read);
        reader = new StreamReader(fileStream);
    }

    public float GetNextValue()
    {
        string? line = reader.ReadLine();

        if (line == null) // reached end of file, loop back to start
        {
            fileStream.Seek(0, SeekOrigin.Begin);
            reader.DiscardBufferedData();
            line = reader.ReadLine();
        }

        if (line == null) // file is empty
        {
            throw new Exception("File is empty.");
        }

        return float.Parse(line);
    }

    ~FileManager()
    {
        if (reader != null)
        {
            reader.Close();
        }

        if (fileStream != null)
        {
            fileStream.Close();
        }
    }
}
