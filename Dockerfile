# =========================
# 1. Build Stage
# =========================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files and restore
COPY ReactApp.Server/*.csproj ./ReactApp.Server/
WORKDIR /src/ReactApp.Server
RUN dotnet restore

# Copy the rest of the files
COPY . .

# Publish
RUN dotnet publish -c Release -o /app/publish --no-restore

# =========================
# 2. Runtime Stage
# =========================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:${PORT:-8080}
EXPOSE 8080

ENTRYPOINT ["dotnet", "ReactApp.Server.dll"]
