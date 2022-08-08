call dotnet publish -c Release -r linux-x64

call cd ..\AccountingSystem.App

call rmdir /s /q dist

call npm install --force
call npm run build

call XCOPY .\dist\app ..\AccountingSystem.Web\wwwroot /S /Y
call XCOPY ..\AccountingSystem.Web\wwwroot ..\AccountingSystem.Web\bin\Release\netcoreapp2.1\linux-x64\publish\wwwroot /S /Y

call cd ..\AccountingSystem.Web

call docker build -t atkseegow/accountingsystem_web:1.1.1 .
call docker push atkseegow/accountingsystem_web:1.1.1

call docker tag atkseegow/accountingsystem_web:1.1.1 atkseegow/accountingsystem_web:latest 
call docker push atkseegow/accountingsystem_web:latest
