# JETDESTEK Platform - Korrigiertes Upload Script
Write-Host "JETDESTEK Platform - Korrigiertes Upload" -ForegroundColor Blue

# FTP Konfiguration
$FTP_HOST = "ftp.jetdestek.com"
$FTP_USER = "cursor@jetdestek.com"
$FTP_PASS = "{H9Nm[f2BLoM}"

Write-Host "Verbinde mit FTP Server: $FTP_HOST" -ForegroundColor Yellow
Write-Host "Benutzer: $FTP_USER" -ForegroundColor Yellow

# Einfache FTP Upload Funktion
function Upload-File {
    param(
        [string]$LocalFile,
        [string]$RemoteFile
    )
    
    try {
        $FtpRequest = [System.Net.FtpWebRequest]::Create("ftp://$FTP_HOST$RemoteFile")
        $FtpRequest.Credentials = New-Object System.Net.NetworkCredential($FTP_USER, $FTP_PASS)
        $FtpRequest.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
        $FtpRequest.UseBinary = $true
        
        $FileContent = [System.IO.File]::ReadAllBytes($LocalFile)
        $FtpRequest.ContentLength = $FileContent.Length
        
        $RequestStream = $FtpRequest.GetRequestStream()
        $RequestStream.Write($FileContent, 0, $FileContent.Length)
        $RequestStream.Close()
        
        $Response = $FtpRequest.GetResponse()
        $Response.Close()
        
        Write-Host "Erfolgreich: $LocalFile -> $RemoteFile" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "Fehler: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Dateien hochladen
Write-Host "Lade Dateien hoch..." -ForegroundColor Yellow

# .htaccess in HAUPTORDNER (wichtig!)
if (Test-Path ".htaccess") {
    Upload-File -LocalFile ".htaccess" -RemoteFile "/public_html/.htaccess"
}

# package.json in Node.js Ordner
if (Test-Path "package.json") {
    Upload-File -LocalFile "package.json" -RemoteFile "/public_html/jetdestek/package.json"
}

Write-Host ""
Write-Host "UPLOAD ABGESCHLOSSEN!" -ForegroundColor Green
Write-Host "Website: https://jetdestek.com" -ForegroundColor Cyan
Write-Host ""
Write-Host "WICHTIG:" -ForegroundColor Yellow
Write-Host "   .htaccess ist im HAUPTORDNER" -ForegroundColor White
Write-Host "   Node.js App ist in /jetdestek/" -ForegroundColor White
Write-Host ""
Write-Host "Nächste Schritte:" -ForegroundColor Yellow
Write-Host "   1. Gehe zu cPanel Node.js Selector" -ForegroundColor White
Write-Host "   2. Starte deine Node.js Anwendung" -ForegroundColor White
Write-Host "   3. Teste deine Website" -ForegroundColor White

