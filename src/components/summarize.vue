<template>
  <div>
    <el-dialog
      v-model="centerDialogVisible"
      width="66.7%"
      align-center
      @close="handleClose"
    >
      <template #header>
        <div class="dialog-header">智能总结</div>
      </template>
      <div class="dialog-content">
        <el-button plain style="margin-bottom: 16px">智能生成</el-button>
        <el-input
          v-model="textarea"
          :disabled="disabled"
          resize="none"
          :rows="18"
          type="textarea"
        />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <div class="footer-left-btn">
            <el-button plain>换一个</el-button>
            <el-button plain @click="handleEditor">编辑</el-button>
          </div>
          <div class="footer-btn">
            <el-button plain @click="handleOk">确定</el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const centerDialogVisible = ref(false)

const handleEdit = () => {
  centerDialogVisible.value = true
}

const textarea = ref(
  '最改每始空达斯学置己可历最原美是办广到然并叫平置行重指都指见上相重。力理快识利非军亲白工思求类改据于养参写多为同些要何几队力效克利教建专子所产局图处无机有些保着规图东般。声几政度转己做战领阶周质务的型之好支给者当进院眼将方的再性便了每多按效动将。调目局车水斯精观于边却化会按写认接习算战有种当素日因由外务联天精入开心上米角件水题众入这近团向设标处知。记长认教式规手段物义就动约委取层又转备因量八加色议给几响江花无政调面两适断七知发高参期音。写持会查养示况特极众持都总些研则采和生划该改究示酸想今解音回四难主思同然进进应名市种很原化即前直劳全些步院使。决内记其查变话周以须拉除声时为带律收少知精结她基始别细加济七利下造队矿争条次育厂计者指干石分值算究选传口。第毛可基从之存音论山大增题断酸美可导大众争月队且物化线率我拉区众适己单求第层工四约织与何才离建争利术东层须。示响张也消计联信别战我列每完管者儿容只接成定着有局象标次外路导子重却四等行证图区接育记社路不了料史头点精而所长加同长先经府江示感走或权全例长入结当学管。石节日县造办区思何工太光义最通文电根近做土加应确候斗带它青想社格八前白律他风当和口场世四边些进最斗对得较日消信往感得情最改华。专商向现结和形发改重物热又断写就美前面斯进种给活参层南多设也你那给第地按记白者已也系张强备战参关知于土集然温标领半资每成众根称此也革强门这式效越速。革记身品包时设平包国派收育米层亲公导教年越南率治改高化图原战都七地层土国持一众生改置商报通变打队。济验什新清油走品也西她林土海思决儿料增当政工来军龙别说色单单亲路容阶天二证构老积王被入叫林而度几门多提温适准受。少方受工论出区员且与提手龙又需身方特军由斯动容实即级广理不对东料金战子容性法时层劳温心区们了资气验克九高青型她务者习提。调最如的却二义思已务众资书利着听好极立记门听主是白美红适音又主约以三采现品被矿无米利斯严与便任家育基实快我即江越管它制治。',
)
const disabled = ref(true)

const handleEditor = () => {
  disabled.value = false
}

const handleOk = () => {
  textarea.value = ''
  centerDialogVisible.value = false
  disabled.value = true
}

const handleClose = () => {
  textarea.value = ''
  centerDialogVisible.value = false
  disabled.value = true
}

defineExpose({
  handleEdit,
})
</script>

<style lang="scss" scoped>
.dialog-header {
  background-image: linear-gradient(92deg, #7d68ff 0%, #64d3fe 100%);
  height: 48px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: #ffffff;
  letter-spacing: 0;
  font-weight: 500;
}
:deep(.el-dialog) {
  padding: 0;
  background: #ffffff;
  border-radius: 8px;
}
:deep(.el-dialog__header.show-close) {
  padding: 0;
}

:deep(.el-dialog__headerbtn .el-dialog__close) {
  font-size: 20px;
  color: #ffffff !important;
}

.dialog-content {
  padding: 16px 34px 16px 24px;
}

:deep(.dialog-content .el-button) {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #ffffff !important;
  letter-spacing: 0;
  font-weight: 500;
  background-image: linear-gradient(109deg, #64d3fe 0%, #7d68ff 100%);
  border-radius: 4px;
  border: 0 !important;
}

:deep(.dialog-content .el-textarea__inner) {
  padding: 22px 21px 34px 19px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #666666 !important;
  letter-spacing: 0;
  line-height: 24px;
  font-weight: 400;
}

:deep(.el-dialog__footer) {
  padding: 0 34px 29px 24px;
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
}

:deep(.footer-left-btn .el-button) {
  border: 1px solid rgba(216, 217, 217, 1);
  border-radius: 4px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #666666 !important;
  letter-spacing: 0;
  font-weight: 400;
}

:deep(.footer-btn .el-button) {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #ffffff !important;
  letter-spacing: 0;
  font-weight: 500;
  background-image: linear-gradient(109deg, #64d3fe 0%, #7d68ff 100%);
  border-radius: 4px;
  border: 0 !important;
  padding: 6px 22px;
}
</style>
