
for /r . %%c in (.) do @if exist "%%c\objchk_wxp_x86" rd /S /Q "%%c\objchk_wxp_x86"
for /r . %%c in (.) do @if exist "%%c\objfre_wxp_x86" rd /S /Q "%%c\objfre_wxp_x86"

for /r . %%c in (.) do @if exist "%%c\objchk_win7_amd64" rd /S /Q "%%c\objchk_win7_amd64"
for /r . %%c in (.) do @if exist "%%c\objfre_win7_amd64" rd /S /Q "%%c\objfre_win7_amd64"

for /r . %%c in (.) do @if exist "%%c\objchk_win7_x86" rd /S /Q "%%c\objchk_win7_x86"
for /r . %%c in (.) do @if exist "%%c\objfre_win7_x86" rd /S /Q "%%c\objfre_win7_x86"


for /r . %%c in (.) do @if exist "%%c\Release" rd /S /Q "%%c\Release"
for /r . %%c in (.) do @if exist "%%c\Debug" rd /S /Q "%%c\Debug"

::Remove files
for /r . %%c in (*.wrn *.err *.aps *.bsc *.clw *.dsw *.ilk *.mac *.ncb *.obj *.opt *.plg *.positions *.suo *.user *.WW) do del /f /q "%%c"


del /s /q /A *.suo



del /s /q /A buildchk_win7_x86.log
del /s /q /A buildfre_win7_x86.log
del /s /q /A buildfre_wxp_x86.log
del /s /q /A buildchk_wxp_x86.log
del /s /q /A buildfre_win7_amd64.log
del /s /q /A buildchk_win7_amd64.log


del /s /q /A PREfast_defects_chk_win7_AMD64Sum.txt
del /s /q /A PREfast_defects_fre_win7_AMD64Sum.txt


del /s /q /A PREfast_defects_chk_win7_x86Sum.txt
del /s /q /A PREfast_defects_fre_win7_x86Sum.txt


del /s /q /A PREfast_defects_chk_win7_AMD64.xml
del /s /q /A PREfast_defects_fre_win7_AMD64.xml

del /s /q /A PREfast_defects_chk_win7_x86.xml
del /s /q /A PREfast_defects_fre_win7_x86.xml

del /s /q /A prefastchk_win7_AMD64.log
del /s /q /A prefastfre_win7_AMD64.log

del /s /q /A prefastchk_win7_x86.log
del /s /q /A prefastfre_win7_x86.log

