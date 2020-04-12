call cd .\wwwroot\app

call npm run tsc

call cd ..\..

call dotnet publish -c Release -r linux-x64

call docker build -t atkseegow/accounting_system_web .

call docker push atkseegow/accounting_system_web:latest
