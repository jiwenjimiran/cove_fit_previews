using Cove.Plugins;
using Microsoft.Extensions.DependencyInjection;

namespace Cove.FitPreviews;

public sealed class FitPreviewsExtension : IExtension, IUIExtension
{
    public string Id => "io.github.jiwenjimiran.fit-previews";
    public string Name => "Fit Previews";
    public string Version => "1.0.0";
    public string? Description => "Fit video covers, animated previews, and scrub frames inside thumbnails without cropping.";
    public string? Author => "jiwenji";
    public string? Url => "https://github.com/jiwenjimiran/cove_fit_previews";
    public string? IconUrl => null;
    public string? MinCoveVersion => "1.5.1";
    public IReadOnlyList<string> Categories => ["ui", "style"];
    public void ConfigureServices(IServiceCollection services, ExtensionContext context) { }
    public UIManifest GetUIManifest() => new();
}
