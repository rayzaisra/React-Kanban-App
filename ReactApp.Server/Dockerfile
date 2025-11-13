# =========================
# 1. Build Stage
# =========================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore
COPY *.csproj ./
RUN dotnet restore

# Copy all source and build
COPY . .
RUN dotnet publish -c Release -o /app/publish --no-restore

# =========================
# 2. Runtime Stage
# =========================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

# Railway automatically provides $PORT at runtime.
# So we hardcode EXPOSE 8080 (static) and use PORT env when running.
ENV ASPNETCORE_URLS=http://+:${PORT:-8080}
EXPOSE 8080

ENTRYPOINT ["dotnet", "ReactApp.Server.dll"]
