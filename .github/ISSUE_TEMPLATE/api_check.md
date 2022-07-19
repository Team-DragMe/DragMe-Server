---
name: API CHECK
about: Check Implemented API
title: "[IMPROVE]"
labels: enhancement, fix
assignees: ''

---

**About API**
API 설명 : 

**To-Do List**
- [ ] id 길이 체크하는 로직 확인 후 삭제
- [ ] Controller에 Slack Error Tracking 코드 추가
- [ ] request query, body 점검 (id처럼 자원 식별용이면 query)
- [ ] scheduleId도 type string으로 통일
- [ ] userId는 무조건 Controller단에서 string으로 만들고 넘기기
- [ ] req.body로 받은 데이터 dto 적용되어 있는지 확인
- [ ] 더 효율적으로 할 수 있을 것 같은 부분 있으면 알려주기
- [ ] API 명세서 재확인 후 수정
