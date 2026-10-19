$d='D:\work\yoga-lab-pixel\workspace\output\suy-giap-v7\hinh-nguon'
$ua='YogaLabBot/1.0 (tranvanthinh81096@gmail.com)'
$items=@(
@('giai-phau-tuyen-giap-truoc.jpg','Anterior_thyroid.jpg'),
@('giai-phau-tuyen-giap-sau.jpg','Posterior_thyroid.jpg'),
@('giai-phau-tuyen-giap-gray.png','Thyroid2-dumb-no-figures.png'),
@('dong-mach-giap-tren-duoi.png','Arterial_and_venous_supply_of_the_thyroid_gland.png'),
@('nang-giap-te-bao-nang.jpg','Thyroid_follicle_cells.jpg'),
@('vong-phan-hoi-am-openstax.jpg','1813_A_Classic_Negative_Feedback_Loop.jpg'),
@('hashimoto-mo-benh-hoc.jpg',"Hashimoto%27s_thyroiditis,_HE_1.jpg"))
foreach($i in $items){
 try{
  $j=Invoke-RestMethod -UserAgent $ua -Uri "https://commons.wikimedia.org/w/api.php?action=query&titles=File:$($i[1])&prop=imageinfo&iiprop=url|size&format=json"
  $ii=($j.query.pages.PSObject.Properties.Value)[0].imageinfo[0]
  Start-Sleep 4
  Invoke-WebRequest -UserAgent $ua -Uri $ii.url -OutFile "$d\$($i[0])"
  "$($i[0]) OK $($ii.width)x$($ii.height) $((Get-Item "$d\$($i[0])").Length)"
 }catch{ "$($i[0]) FAIL $($_.Exception.Message)" }
}
