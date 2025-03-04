# Time

The time folder provides various components that allow users to input and manipulate time-related data. These components ensure proper formatting, validation, and interaction with date-time pickers, range selectors, and time zones.

## `KDate`

This component is a date picker button. It allows users to select a date by clicking a button that opens a popup calendar built using **Quasar** component [QDate](https://quasar.dev/vue-components/date/).

### Props

| **Prop**        | **Type**   | **Default**      | **Description** |
|----------------|-----------|----------------|----------------|
| `modelValue`   | String  | `null`         | The selected date value, used with `v-model`. |
| `picker`       | Object  | `null`         | Configuration options for the `QDate` picker. |
| `format`       | String  | `null`         | Custom date format for displaying the selected date. |
| `placeholder`  | String  | `null`         | Text shown when no date is selected. |
| `icon`         | String  | `'las la-calendar'` | Icon displayed on the button. |
| `disabled`     | Boolean | `false`        | Disables the button and prevents date selection. |
| `dense`        | Boolean | `false`        | Controls the button's padding (compact styling). |

### Usage

To define a date input with the format `DD/MM/YY`, you can configure the `KDate` component as follows:

```html
<KDate 
  v-model="dateValue" 
  :date-format="'DD/MM/YY'" 
/>
```

## `KTime`

This component is a time picker button. It allows users to select a time by clicking a button that opens a popup calendar built using **Quasar** component [QTime](https://quasar.dev/vue-components/time)

## Props

| **Prop**        | **Type**   | **Default**      | **Description** |
|----------------|-----------|----------------|----------------|
| `modelValue`   | String  | `null`         | The selected time value, used with `v-model`. |
| `picker`       | Object  | `null`         | Configuration options for the `QTime` picker. |
| `withSeconds`  | Boolean | `false`        | Determines whether seconds should be displayed in the time picker. |
| `format`       | String  | `null`         | Custom time format for displaying the selected time. |
| `placeholder`  | String  | `null`         | Text shown when no time is selected. |
| `icon`         | String  | `'las la-clock'` | Icon displayed on the button. |
| `disabled`     | Boolean | `false`        | Disables the button and prevents time selection. |
| `dense`        | Boolean | `false`        | Controls the button's padding (compact styling). |

### Usage

To define a time input without an icon and that accounts for seconds, you can configure the `KTime` component with the following props:

```html
<KTime 
  v-model="timeValue" 
  :icon="null" 
  :with-seconds="true" 
/>
```

## `KDateTime`

This component provides a combined date and time picker, allowing users to select both a date and a time within a single UI element. It utilizes [KDate](#kdate) for the date selection and [KTime](#time) for the time selection, offering customization options for formatting, styling, and validation.

### Props

## Props

| **Prop**        | **Type**   | **Default**      | **Description** |
|----------------|-----------|----------------|----------------|
| `modelValue`   | String  | `null`         | The selected date-time value, used with `v-model`. Must be a valid date-time string. |
| `datePicker`   | Object  | `null`         | Configuration options for the `KDate` picker. |
| `timePicker`   | Object  | `null`         | Configuration options for the `KTime` picker. |
| `withSeconds`  | Boolean | `false`        | Determines whether seconds should be displayed in the time picker. |
| `dateFormat`   | String  | `null`         | Custom format for displaying the date. |
| `timeFormat`   | String  | `null`         | Custom format for displaying the time. |
| `dateClass`    | String  | `''`           | Custom CSS class for styling the date input. |
| `timeClass`    | String  | `''`           | Custom CSS class for styling the time input. |
| `separator`    | String  | `'-'`          | Separator string between the date and time. |
| `min`          | String  | `null`         | Minimum selectable date-time value. Must be a valid date-time string. |
| `max`          | String  | `null`         | Maximum selectable date-time value. Must be a valid date-time string. |
| `timezone`     | String  | `null`         | Timezone for displaying and selecting the date-time. |
| `placeholder`  | String  | `null`         | Placeholder text when no date-time is selected. |
| `icon`         | String  | `'las la-calendar'` | Icon displayed on the date picker button. |
| `disabled`     | Boolean | `false`        | Disables the date-time picker. |
| `dense`        | Boolean | `false`        | Controls the padding and spacing of the component (compact styling). |

### Usage

To define a timestamp input with the format `DD/MM/YY` for the date and `HH:mm:ss` for the time, you can use the `KDateTime` component like this:

```html
<KDateTime
  v-model="dateTimeValue"
  :date-format="'DD/MM/YY'"
  :time-format="'HH:mm:ss'"
  :with-seconds="true"
/>
```

## `KDateTimeRange`

This component is a date-time range selector that allows users to pick a start and end date-time. It integrates two [KDateTime](#kdatetime) components with optional range slider support for easier selection. The component ensures valid date ranges, supports time zones, and allows custom formatting.

### Props

### **Props Table**  

| Prop Name         | Type    | Default          | Description | Additional Notes |
|------------------|--------|----------------|-------------|----------------|
| `modelValue`    | Object | `null`         | Contains `start` and `end` date-time values. | Ensures validity using Moment.js. Updates when `startTimeModel` or `endTimeModel` changes. |
| `datePicker`    | Object | `null`         | Configuration options for the date picker. | Merged with default date picker settings. |
| `timePicker`    | Object | `null`         | Configuration options for the time picker. | Merged with default time picker settings. |
| `withSeconds`   | Boolean | `false`       | Determines whether seconds should be displayed in the time picker. | Affects the `KDateTime` time format. |
| `dateFormat`    | String  | `null`        | Custom format for displaying dates. | Overrides default date format in `KDateTime`. |
| `timeFormat`    | String  | `null`        | Custom format for displaying times. | Overrides default time format in `KDateTime`. |
| `dateClass`     | String  | `""`          | CSS class applied to the date picker. | Allows custom styling for the date input. |
| `timeClass`     | String  | `""`          | CSS class applied to the time picker. | Allows custom styling for the time input. |
| `separator`     | String  | `'/'`         | Separator between the date and time components. | Affects the display format. |
| `dateTimeSeparator` | String | `'-'`      | Separator between start and end date-time values. | Affects the visual distinction between date-time pairs. |
| `min`          | String  | `null`         | Minimum selectable date-time value. | Must be a valid date-time. Adjusts `startTimeModel` if necessary. |
| `max`          | String  | `null`         | Maximum selectable date-time value. | Must be a valid date-time. Adjusts `endTimeModel` if necessary. |
| `timezone`     | String  | `null`         | Timezone in which the date-time values are displayed. | Converts the date-time using `toLocalTimezone()`. |
| `slider`       | Object  | `null`         | Configuration object for the optional range slider. It conforms the [Quasar QRange API](https://quasar.dev/vue-components/range/). In addition it support the `stacked` property to display the slider above the time labels. | Enables the range slider if provided. |
| `icon`         | String  | `'las la-calendar'` | Icon displayed in the date-time pickers. | Overrides the default calendar icon. |
| `disabled`     | Boolean | `false`        | Disables the component when `true`. | Prevents user interaction. |
| `dense`        | Boolean | `false`        | Enables a more compact design when `true`. | Affects spacing and layout of the component. |

### Usage

To specify a basic time range, you can configure the `KDateTimeRange` component like this:

```html
<KDateTimeRange
  v-model="dateTimeRangeValue"
/>
```

If you want to use the `KDateTimeRange` component with a slider stacked with the time labels, you can configure it like this:

```html
<KDateTimeRange
  v-model="dateTimeRangeValue"
  :min="minTime"
  :max="maxTime"
  :slider="{ stacked: true }"
/>
```
