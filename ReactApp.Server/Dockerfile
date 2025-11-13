# ============================================
# 1️⃣ BUILD STAGE
# ============================================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project file and restore dependencies
COPY ReactApp.Server.csproj ./
RUN dotnet restore --disable-parallel --ignore-failed-sources

# Copy the rest of the code
COPY . .

# Build and publish to /app/out
RUN dotnet publish -c Release -o /app/out

# ============================================
# 2️⃣ RUNTIME STAGE
# ============================================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copy build output
COPY --from=build /app/out .

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Expose port
EXPOSE 8080

# Run the application
ENTRYPOINT ["dotnet", "ReactApp.Server.dll"]
