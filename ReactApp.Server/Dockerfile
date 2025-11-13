# ───────────────────────────────────────────────
#  Base image for runtime
# ───────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 443

# ───────────────────────────────────────────────
#  Build stage
# ───────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the csproj and restore dependencies
COPY ["ReactApp.Server.csproj", "./"]
RUN dotnet restore "ReactApp.Server.csproj" --disable-parallel --ignore-failed-sources

# Copy all source code
COPY . .

# Build the app
RUN dotnet build "ReactApp.Server.csproj" -c Release -o /app/build

# ───────────────────────────────────────────────
#  Publish stage
# ───────────────────────────────────────────────
FROM build AS publish
RUN dotnet publish "ReactApp.Server.csproj" -c Release -o /app/publish /p:UseAppHost=false

# ───────────────────────────────────────────────
#  Final runtime stage
# ───────────────────────────────────────────────
FROM base AS final
WORKDIR /app

# Copy published output
COPY --from=publish /app/publish .

# Environment config (Railway uses PORT)
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Start the app
ENTRYPOINT ["dotnet", "ReactApp.Server.dll"]
