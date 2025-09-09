# Dropdown Components

이 프로젝트에서 사용할 수 있는 재사용 가능한 Dropdown 컴포넌트들입니다. 모든 컴포넌트는 Headless UI를 기반으로 구축되어 접근성과 키보드 네비게이션을 지원합니다.

## 컴포넌트 종류

### 1. Dropdown (기본)

기본적인 단일 선택 드롭다운 컴포넌트입니다.

```jsx
import Dropdown from './components/common/Dropdown';

const statusOptions = [
  { value: "all", label: "모든 상태" },
  { value: "active", label: "활성" },
  { value: "inactive", label: "비활성" }
];

function Example() {
  const [status, setStatus] = useState("all");

  return (
    <Dropdown
      options={statusOptions}
      value={status}
      onChange={setStatus}
      placeholder="상태 선택"
      width="w-48"
    />
  );
}
```

### 2. SearchableDropdown (검색 기능)

검색 기능이 있는 드롭다운 컴포넌트입니다.

```jsx
import SearchableDropdown from './components/common/SearchableDropdown';

const employeeOptions = [
  { value: "1", label: "김철수" },
  { value: "2", label: "이영희" },
  { value: "3", label: "박민수" },
  // ... 많은 옵션들
];

function Example() {
  const [selectedEmployee, setSelectedEmployee] = useState("");

  return (
    <SearchableDropdown
      options={employeeOptions}
      value={selectedEmployee}
      onChange={setSelectedEmployee}
      placeholder="직원 선택"
      searchPlaceholder="직원 이름 검색..."
      clearable={true}
      width="w-64"
    />
  );
}
```

### 3. MultiSelectDropdown (다중 선택)

여러 항목을 선택할 수 있는 드롭다운 컴포넌트입니다.

```jsx
import MultiSelectDropdown from './components/common/MultiSelectDropdown';

const skillOptions = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue.js" },
  { value: "angular", label: "Angular" },
  { value: "nodejs", label: "Node.js" }
];

function Example() {
  const [selectedSkills, setSelectedSkills] = useState([]);

  return (
    <MultiSelectDropdown
      options={skillOptions}
      values={selectedSkills}
      onChange={setSelectedSkills}
      placeholder="기술 스택 선택"
      maxDisplay={2}
      width="w-80"
    />
  );
}
```

## Props 설명

### 공통 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | Array | `[]` | 드롭다운 옵션 배열 `[{ value: string, label: string }]` |
| `placeholder` | string | `'선택하세요'` | 아무것도 선택되지 않았을 때 표시할 텍스트 |
| `className` | string | `''` | 추가 CSS 클래스 |
| `disabled` | boolean | `false` | 비활성화 여부 |
| `width` | string | `'w-full'` | 드롭다운 너비 (Tailwind CSS 클래스) |
| `anchor` | string | `'bottom start'` | 드롭다운 위치 |

### Dropdown 전용 Props

| Prop | Type | Description |
|------|------|-------------|
| `value` | string | 현재 선택된 값 |
| `onChange` | function | 값 변경 핸들러 `(value: string) => void` |

### SearchableDropdown 전용 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | string | | 현재 선택된 값 |
| `onChange` | function | | 값 변경 핸들러 `(value: string) => void` |
| `searchPlaceholder` | string | `'검색...'` | 검색 입력창 플레이스홀더 |
| `clearable` | boolean | `false` | 선택 해제 버튼 표시 여부 |

### MultiSelectDropdown 전용 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `values` | Array | `[]` | 현재 선택된 값들의 배열 |
| `onChange` | function | | 값 변경 핸들러 `(values: string[]) => void` |
| `maxDisplay` | number | `2` | 버튼에 표시할 최대 선택된 항목 수 |

## 스타일링

모든 컴포넌트는 Tailwind CSS를 사용하여 스타일링되어 있습니다. 추가적인 스타일링이 필요한 경우 `className` prop을 사용하여 커스텀 클래스를 추가할 수 있습니다.

### 기본 스타일

- 포커스 시 파란색 링
- 호버 시 보더 색상 변경
- 부드러운 트랜지션 효과
- 접근성을 위한 적절한 색상 대비

### 커스터마이징 예제

```jsx
<Dropdown
  options={options}
  value={value}
  onChange={onChange}
  className="bg-gray-50 border-2 border-gray-400"
  width="w-96"
/>
```

## 마이그레이션 가이드

기존의 `<select>` 요소를 Dropdown 컴포넌트로 교체하는 방법:

### Before (기존)

```jsx
<select value={status} onChange={(e) => setStatus(e.target.value)}>
  <option value="all">모든 상태</option>
  <option value="active">활성</option>
  <option value="inactive">비활성</option>
</select>
```

### After (새로운 방식)

```jsx
<Dropdown
  options={[
    { value: "all", label: "모든 상태" },
    { value: "active", label: "활성" },
    { value: "inactive", label: "비활성" }
  ]}
  value={status}
  onChange={setStatus}
/>
```

## 키보드 네비게이션

모든 드롭다운 컴포넌트는 다음 키보드 단축키를 지원합니다:

- `Space` / `Enter`: 드롭다운 열기/닫기
- `↑` / `↓`: 옵션 간 이동
- `Esc`: 드롭다운 닫기
- `A-Z`: 해당 문자로 시작하는 옵션으로 점프 (기본 드롭다운)

## 접근성 특징

- ARIA 라벨링
- 스크린 리더 지원
- 키보드 네비게이션
- 포커스 관리
- 적절한 색상 대비
