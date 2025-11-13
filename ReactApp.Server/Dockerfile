# ───────────────────────────────────────────────
# 1️⃣ Base image for runtime
# ───────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
# Railway will inject its own dynamic PORT
EXPOSE 8080

# ───────────────────────────────────────────────
# 2️⃣ Build stage
# ───────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["ReactApp.Server.csproj", "./"]
RUN dotnet restore "ReactApp.Server.csproj" --disable-parallel --ignore-failed-sources

# Copy all remaining source code
COPY . .

# Build the application
RUN dotnet build "ReactApp.Server.csproj" -c Release -o /app/build

# ───────────────────────────────────────────────
# 3️⃣ Publish stage
# ───────────────────────────────────────────────
FROM build AS publish
RUN dotnet publish "ReactApp.Server.csproj" -c Release -o /app/publish /p:UseAppHost=false

# ───────────────────────────────────────────────
# 4️⃣ Final runtime image
# ───────────────────────────────────────────────
FROM base AS final
WORKDIR /app

# Copy published output from previous stage
COPY --from=publish /app/publish .

# Railway sets PORT dynamically (e.g., 54321)
ENV ASPNETCORE_URLS=http://+:${PORT}
ENV ASPNETCORE_ENVIRONMENT=Production

# Expose that port
EXPOSE ${PORT}

# Launch the app
ENTRYPOINT ["dotnet", "ReactApp.Server.dll"]
