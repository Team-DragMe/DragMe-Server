# DragMe-Server

### 드래그 기반의 유연한 시간관리로 만들어가는 주체적인 삶의 계획표

![DragMe_Poster](https://user-images.githubusercontent.com/21357387/177603982-fe71f427-46ce-4082-a561-343c9fe8ae14.png)

> SOPT 30th - THE SOPT App-Jam </b>
>
> 프로젝트 기간: 2022.07.04 ~ 2022.07.23

### 🛠 Development Environment

![Typescript](https://img.shields.io/badge/Typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/Node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)

### 📑 Collection

```typescript
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    goal: {
      type: String,
    },
    badge: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
```

```typescript
const ScheduleSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    estimatedTime: {
      type: [Number],
    },
    usedTime: {
      type: [Number],
    },
    title: {
      type: String,
      required: true,
    },
    subSchedules: {
      type: [mongoose.Types.ObjectId],
      ref: 'Schedule',
    },
    categoryColorCode: {
      type: String,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    isReschedule: {
      type: Boolean,
      default: false,
    },
    isRoutine: {
      type: Boolean,
      default: false,
    },
    orderIndex: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);
```

```typescript
const InformationSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    value: {
      type: String,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);
```

### 📏 Code Convention

<details>
<summary>변수명</summary>   
<div markdown="1">       
      
 
 1. Camel Case 사용 
   - lower Camel Case
 2. 함수의 경우 동사+명사 사용 
   - ex) getInformation()
 3. flag로 사용 되는 변수는 조동사 + flag 종류로 구성 
   - ex) isNum
 4. 약어는 되도록 사용하지 않는다.
   - 부득이하게 약어가 필요하다고 판단되는 경우 팀원과 상의를 거친다.
 
</div>
</details>

<details>
<summary>주석</summary>
<div markdown="1">

1.  한줄 주석은 // 를 사용한다.

```typescript
// 한줄 주석일 때
/**
 * 여러줄
 * 주석일 때
 */
```

2.  함수에 대한 주석

```typescript
/**
 * @route Method /Route
 * @desc Function Description
 * @access Public
 */
```

3.  Bracket 사용 시 내부에 주석을 작성한다.

```typescript
if (a == 5) {
  // 주석
}
```

</div>
</details>

<details>
<summary>Bracket</summary>
<div markdown="1">

1.  한줄 if 문은 여러 줄로 작성한다.

```typescript
// 한줄 if 문 - 여러 줄로 작성
if (trigger) {
  return;
}
```

2. 괄호는 한칸 띄우고 사용한다.

```typescript
// 괄호 사용 한칸 띄우고 사용한다.
if (left == true) {
  return;
}
```

3. Bracket 양쪽 사이를 띄어서 사용한다.

```typescript
const { userId } = request.user;
```

</div>
</details>

<details>
<summary>비동기 함수의 사용</summary>
<div markdown="1">

1.  async, await 함수 사용을 지향한다.
2.  Promise 사용은 지양한다.
3.  다만 로직을 짜는 데 있어 promise를 불가피하게 사용할 경우, 주석으로 표시하고 commit에 그 이유를 작성한다.

</div>
</details>

### 📌 Commit Convention

##### [TAG] 메시지

| 태그 이름  |                               설명                                |
| :--------: | :---------------------------------------------------------------: |
|  [CHORE]   |                     코드 수정, 내부 파일 수정                     |
|   [FEAT]   |                         새로운 기능 구현                          |
|   [ADD]    | FEAT 이외의 부수적인 코드 추가, 라이브러리 추가, 새로운 파일 생성 |
|  [HOTFIX]  |               issue나 QA에서 급한 버그 수정에 사용                |
|   [FIX]    |                          버그, 오류 해결                          |
|   [DEL]    |                        쓸모 없는 코드 삭제                        |
|   [DOCS]   |                   README나 WIKI 등의 문서 개정                    |
| [CORRECT]  |         주로 문법의 오류나 타입의 변경, 이름 변경에 사용          |
|   [MOVE]   |                 프로젝트 내 파일이나 코드의 이동                  |
|  [RENAME]  |                   파일 이름 변경이 있을 때 사용                   |
| [IMPROVE]  |                        향상이 있을 때 사용                        |
| [REFACTOR] |                     전면 수정이 있을 때 사용                      |

### 🌿 Branch Strategy

<details>
<summary>Git Workflow</summary>
<div markdown="1">

```
main → develop → feature_# / fix_#
feature, fix 이하 번호는 issue 번호에 맞게 생성

1. issue 생성
2. local - feature_# / fix_# 에서 각자 기능 작업
3. remote - feature_# / fix_# 에 Push
4. remote - develop 으로 PR
5. 코드 리뷰 후 Confirm 받고 remote - develop Merge
6. remote - develop 에 Merge 될 때 마다 모든 팀원 local - develop pull 받아 최신 상태 유지
```

</div>
</details>

| Branch Name |           설명           |
| :---------: | :----------------------: |
|    main     |      초기 세팅 존재      |
|   develop   |     구현 완료 브랜치     |
| feature\_#  | 이슈 별 기능 구현 브랜치 |
|   fix\_#    |   이슈 별 픽스 브랜치    |

### 📁 Project Foldering

```
🗃️ 3-Layer Architecture 적용

📁 src _
|_ 📁 config _
             |_ 📋 index.ts
|_ 📁 controllers _
                  |_ 📋 index.ts
                  |_ 📋 InformationController.ts
                  |_ 📋 ScheduleController.ts
                  |_ 📋 UserController.ts
|_ 📁 interfaces _
                 |_ 📁 information
                 |_ 📁 schedule
                 |_ 📁 user
|_ 📁 loaders _
              |_ 📋 db.ts
|_ 📁 models _
             |_ 📋 Information.ts
             |_ 📋 Schedule.ts
             |_ 📋 User.ts
|_ 📁 modules _
              |_ 📋 responseMessage.ts
              |_ 📋 returnToSlackMessage.ts
              |_ 📋 slackAPI.ts
              |_ 📋 statusCode.ts
              |_ 📋 util.ts
|_ 📁 routes _
             |_ 📋 index.ts
             |_ 📋 InformationRouter.ts
             |_ 📋 ScheduleRouter.ts
             |_ 📋 UserRouter.ts
|_ 📁 services _
               |_ 📋 index.ts
               |_ 📋 InformationService.ts
               |_ 📋 ScheduleService.ts
               |_ 📋 UserService.ts
|_ 📋 index.ts
```

### 💼 Roles (API) & Progess Status

|                 기능명                 |     담당자     | 완료 여부 |
| :------------------------------------: | :------------: | :-------: |
|     일간 계획 계획블록 리스트 조회     |     주효식     |    ✅     |
|          일간 계획 정보 조회           |     강민재     |    ✅     |
|               정보 작성                | 주효식, 강민재 |    ✅     |
|       미뤄진 계획블록 목록 조회        |     강민재     |    ✅     |
|            계획블록 미루기             |     강민재     |    ✅     |
|     미룬 계획블록 계획표로 옮기기      |     주효식     |    ✅     |
|           계획블록 완료하기            |     강민재     |    ✅     |
|             계획블록 생성              |     주효식     |    ✅     |
|           계획블록 시간 설정           |     강민재     |    ✅     |
|           계획블록 시간 삭제           |     강민재     |    ✅     |
|             계획블록 삭제              |     강민재     |    ✅     |
|             계획블록 수정              |     주효식     |    ✅     |
|           하위 계획블록 조회           |     강민재     |    ✅     |
|        날짜별 일정 존재 여부 조회      |     주효식     |    ✅     |
|        자주 사용하는 계획 조회         |     주효식     |    ✅     |
|        계획블록 카테고리 변경          |     주효식     |    ✅     |
|        자주 사용하는 계획 등록         |     주효식     |    ✅     |
| 자주 사용하는 계획블록 계획표로 옮기기 |     강민재     |     ✅     |
|           계획블록 이름 수정           |     주효식     |    ✅     |
|     주간 계획 계획블록 리스트 조회     |     주효식     |     ✅    |
|          주간 계획 이모지 조회         |     주효식     |     ✅    |
|           계획블록 요일 이동           |     강민재     |     ✅    |
|           계획블록 순서 변경           |     주효식     |     ✅    |
|             주간 목표 조회             |     강민재     |    ✅     |
|             월간 목표 조회             |     강민재     |    ✅     |

### 🧑‍💻 Developers

|                                                                                    주효식 HYOSITIVE                                                                                     |                                                                                      강민재 m1njae                                                                                      |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| <a href="https://github.com/HYOSITIVE"><img src="https://user-images.githubusercontent.com/21357387/177687634-9498573e-7d2b-42f5-b312-66183e9593f3.jpg" width="200px" height="200px" /> | <a href="https://github.com/m1njae"><img src ="https://user-images.githubusercontent.com/21357387/177687625-92731611-1e29-41e0-9e87-8bc3ef1ddac3.jpg" width = "200px" height="200px" /> |

<img width="500" alt="광기" src="https://user-images.githubusercontent.com/21357387/177604314-2c322887-4e75-4c12-8b67-37e40173af19.png">
