# ──────────────────────────────────────────────────────────────
#  .NET 8 API – Render.com Optimized Dockerfile
#  Multi-stage build → Small image (~200 MB), Fast deploy
# ──────────────────────────────────────────────────────────────

# STAGE 1: Build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy project file and restore (fast cache)
COPY *.csproj ./
RUN dotnet restore

# Copy all source code
COPY . ./

# Build and publish
RUN dotnet publish -c Release -o /app/publish --no-restore

# STAGE 2: Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy published app
COPY --from=build /app/publish ./

# ──────────────────────────────────────────────────────────────
#  RENDER.COM CONFIG
#  - Uses $PORT (auto-assigned by Render)
#  - Health check (optional)
# ──────────────────────────────────────────────────────────────

ENV ASPNETCORE_URLS=http://+:${PORT}
EXPOSE ${PORT}

# Health check (Render uses this to know if app is ready)
HEALTHCHECK CMD curl --fail http://localhost:${PORT}/health || exit 1

# Start the app
ENTRYPOINT ["dotnet", "ReactApp.Server.dll"]