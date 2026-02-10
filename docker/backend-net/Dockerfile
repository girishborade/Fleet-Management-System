# Stage 1: Build the application
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY Backend.NET/FleetManagementSystem.Api.csproj ./Backend.NET/
RUN dotnet restore "./Backend.NET/FleetManagementSystem.Api.csproj"
COPY Backend.NET/ ./Backend.NET/
WORKDIR "/src/Backend.NET"
RUN dotnet publish -c Release -o /app/publish

# Stage 2: Run the application
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "FleetManagementSystem.Api.dll"]
