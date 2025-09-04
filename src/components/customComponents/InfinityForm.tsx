import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import {
  Typography,
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
  Toggle,
  DatePicker,
  TimePicker,
  ColorPicker,
  Button,
  Card,
  CardBody,
  FileInput,
  Rating,
  Range,
  Modal,
  InfinityIcons,
} from '@/components'
import { getIconComponent } from '@/utils'

// Types (keeping all the same interfaces)
interface BaseFieldConfig {
  name: string
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  helperText?: string
  error?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  variant?: string
  className?: string
  gridCols?: 1 | 2 | 3 | 4 | 6 | 12
  conditional?: {
    dependsOn: string
    value: any
    operator?: 'equals' | 'notEquals' | 'includes' | 'notIncludes'
  }
}

interface InputFieldConfig extends BaseFieldConfig {
  type: 'input'
  inputType?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  value?: string | number
  onChange?: (value: string | number) => void
  min?: number
  max?: number
  step?: number
}

interface TextareaFieldConfig extends BaseFieldConfig {
  type: 'textarea'
  rows?: number
  value?: string
  onChange?: (value: string) => void
  autoResize?: boolean
}

interface SelectFieldConfig extends BaseFieldConfig {
  type: 'select' | 'multiSelect'
  options: Array<{ value: string; label: string; disabled?: boolean }>
  value?: string | string[]
  onChange?: (value: string | string[]) => void
  searchable?: boolean
  clearable?: boolean
}

interface RadioFieldConfig extends BaseFieldConfig {
  type: 'radio'
  options: Array<{ value: string; label: string; disabled?: boolean }>
  value?: string
  onChange?: (value: string) => void
  direction?: 'horizontal' | 'vertical'
}

interface CheckboxFieldConfig extends BaseFieldConfig {
  type: 'checkbox'
  options?: Array<{ value: string; label: string; disabled?: boolean }>
  value?: boolean | string[]
  onChange?: (value: boolean | string[]) => void
  single?: boolean
}

interface ToggleFieldConfig extends BaseFieldConfig {
  type: 'toggle'
  value?: boolean
  onChange?: (value: boolean) => void
  onLabel?: string
  offLabel?: string
}

interface DatePickerFieldConfig extends BaseFieldConfig {
  type: 'datePicker' | 'dateRange'
  value?: string | { start: string; end: string }
  onChange?: (value: string | { start: string; end: string }) => void
  format?: string
}

interface TimePickerFieldConfig extends BaseFieldConfig {
  type: 'timePicker' | 'timeRange'
  value?: string | { start: string; end: string }
  onChange?: (value: string | { start: string; end: string }) => void
  format?: '12h' | '24h'
}

interface ColorPickerFieldConfig extends BaseFieldConfig {
  type: 'colorPicker'
  value?: string
  onChange?: (value: string | null) => void
  showAlpha?: boolean
  showPresets?: boolean
  showEyeDropper?: boolean
}

interface FileInputFieldConfig extends BaseFieldConfig {
  type: 'fileInput'
  value?: File | File[]
  onChange?: (value: File | File[]) => void
  accept?: string
  multiple?: boolean
  maxSize?: number
  preview?: boolean
}

interface RangeFieldConfig extends BaseFieldConfig {
  type: 'range'
  value?: number | [number, number]
  onChange?: (value: number | [number, number]) => void
  min?: number
  max?: number
  step?: number
  dual?: boolean
  showValue?: boolean
}

interface RatingFieldConfig extends BaseFieldConfig {
  type: 'rating'
  value?: number
  onChange?: (value: number) => void
  max?: number
  allowHalf?: boolean
  readonly?: boolean
}

interface CustomFieldConfig extends BaseFieldConfig {
  type: 'custom'
  render: (props: { value: any; onChange: (value: any) => void; error?: string }) => React.ReactNode
  value?: any
  onChange?: (value: any) => void
}

interface DividerConfig {
  type: 'divider'
  label?: string
  className?: string
}

interface HeadingConfig {
  type: 'heading'
  text: string
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  className?: string
}

interface SpacerConfig {
  type: 'spacer'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

// Add the new IconPicker field interface
interface IconPickerFieldConfig extends BaseFieldConfig {
  type: 'iconPicker'
  value?: string
  onChange?: (value: string) => void
  iconSize?: number
  showPreview?: boolean
}

type FieldConfig =
  | InputFieldConfig
  | TextareaFieldConfig
  | SelectFieldConfig
  | RadioFieldConfig
  | CheckboxFieldConfig
  | ToggleFieldConfig
  | DatePickerFieldConfig
  | TimePickerFieldConfig
  | ColorPickerFieldConfig
  | FileInputFieldConfig
  | RangeFieldConfig
  | RatingFieldConfig
  | IconPickerFieldConfig  // Add this line
  | CustomFieldConfig
  | DividerConfig
  | HeadingConfig
  | SpacerConfig

interface ActionButtonConfig {
  label: string
  type: 'submit' | 'button' | 'reset'
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'link' | 'success' | 'warning' | 'error'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  className?: string
}

interface InfinityFormProps {
  fields: FieldConfig[]
  onSubmit?: (data: Record<string, any>) => void
  title?: string
  subtitle?: string
  icon?: React.ReactNode
  loading?: boolean
  columns?: 1 | 2 | 3 | 4
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  actions?: ActionButtonConfig[]
  actionsAlignment?: 'left' | 'center' | 'right' | 'between' | 'around'
  className?: string
  formClassName?: string
  headerClassName?: string
  contentClassName?: string
  actionsClassName?: string
  validateOnChange?: boolean
  showRequiredIndicator?: boolean
  resetOnSubmit?: boolean
  headerActions?: React.ReactNode
  initialValues?: Record<string, any>
  onValuesChange?: (values: Record<string, any>) => void
}

export const InfinityForm: React.FC<InfinityFormProps> = ({
  fields,
  onSubmit,
  title,
  subtitle,
  icon,
  loading = false,
  columns = 2,
  gap = 'md',
  actions = [],
  actionsAlignment = 'right',
  className = '',
  formClassName = '',
  headerClassName = '',
  contentClassName = '',
  actionsClassName = '',
  validateOnChange = false,
  showRequiredIndicator = true,
  resetOnSubmit = false,
  headerActions,
  initialValues = {},
  onValuesChange,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Create stable refs for callbacks and props
  const onSubmitRef = useRef(onSubmit)
  const onValuesChangeRef = useRef(onValuesChange)
  const fieldsRef = useRef(fields)
  const initialValuesRef = useRef(initialValues)

  // Update refs on each render to capture latest values
  useEffect(() => {
    onSubmitRef.current = onSubmit
    onValuesChangeRef.current = onValuesChange
    fieldsRef.current = fields
  })

  // Compute initial values only once per fields/initialValues change
  const computeInitialValues = useCallback((fieldsConfig: FieldConfig[], initVals: Record<string, any>) => {
    const defaultValues: Record<string, any> = { ...initVals }

    fieldsConfig.forEach((field) => {
      if ('name' in field && field.name) {
        // Skip if already set from initialValues
        if (defaultValues[field.name] !== undefined) {
          return
        }

        // Use field.value if available
        if ('value' in field && field.value !== undefined) {
          defaultValues[field.name] = field.value
          return
        }

        // Set appropriate defaults based on field type
        switch (field.type) {
          case 'checkbox':
            defaultValues[field.name] = field.single ? false : []
            break
          case 'multiSelect':
            defaultValues[field.name] = []
            break
          case 'toggle':
            defaultValues[field.name] = false
            break
          case 'rating':
            defaultValues[field.name] = 0
            break
          case 'range':
            if ('dual' in field && field.dual) {
              defaultValues[field.name] = [field.min || 0, field.max || 100]
            } else {
              defaultValues[field.name] = field.min || 0
            }
            break
          default:
            defaultValues[field.name] = ''
        }
      }
    })

    return defaultValues
  }, [])

  // Initialize values with memoized computation
  const [values, setValues] = useState<Record<string, any>>(() => 
    computeInitialValues(fields, initialValues)
  )

  // Update values only when initialValues or fields actually change (using deep comparison)
  useEffect(() => {
    const currentInitialValues = JSON.stringify(initialValues)
    const prevInitialValues = JSON.stringify(initialValuesRef.current)
    
    if (currentInitialValues !== prevInitialValues) {
      initialValuesRef.current = initialValues
      const newValues = computeInitialValues(fields, initialValues)
      setValues(newValues)
    }
  }, [initialValues, fields, computeInitialValues])

  // Create a stable onChange handler that doesn't depend on values
  const handleFieldChange = useCallback((fieldName: string, newValue: any) => {
    // Update values state
    setValues(prevValues => {
      const updatedValues = { ...prevValues, [fieldName]: newValue }
      
      // Call external onChange callback asynchronously to avoid sync state updates
      setTimeout(() => {
        if (onValuesChangeRef.current) {
          onValuesChangeRef.current(updatedValues)
        }

        // Call individual field onChange handler
        const field = fieldsRef.current.find(f => 'name' in f && f.name === fieldName)
        if (field && 'onChange' in field && typeof (field as any).onChange === 'function') {
          (field as any).onChange(newValue)
        }
      }, 0)

      return updatedValues
    })

    // Clear field error when value changes
    setErrors(prevErrors => {
      if (prevErrors[fieldName]) {
        const { [fieldName]: _, ...restErrors } = prevErrors
        return restErrors
      }
      return prevErrors
    })

    // Validate on change if enabled
    if (validateOnChange) {
      setTimeout(() => {
        const field = fieldsRef.current.find(f => 'name' in f && f.name === fieldName)
        const isEmpty = !newValue ||
          (Array.isArray(newValue) && newValue.length === 0) ||
          (typeof newValue === 'string' && newValue.trim() === '')

        if (field && 'required' in field && field.required && isEmpty) {
          setErrors(prev => ({
            ...prev,
            [fieldName]: `${field.label || fieldName} is required`
          }))
        }
      }, 0)
    }
  }, [validateOnChange])

  // Validation function
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {}

    fieldsRef.current.forEach((field) => {
      if ('name' in field && 'required' in field && field.required) {
        const value = values[field.name]
        if (!value ||
          (Array.isArray(value) && value.length === 0) ||
          (typeof value === 'string' && value.trim() === '')) {
          newErrors[field.name] = `${field.label || field.name} is required`
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [values])

  // Submit handler
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    const isValid = validateForm()
    if (!isValid) return

    setIsSubmitting(true)
    try {
      if (onSubmitRef.current) {
        await onSubmitRef.current(values)
      }
      
      if (resetOnSubmit) {
        const resetValues = computeInitialValues(fieldsRef.current, initialValuesRef.current)
        setValues(resetValues)
        setErrors({})
      }
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [validateForm, resetOnSubmit, computeInitialValues, values])

  // Reset handler
  const handleReset = useCallback(() => {
    const resetValues = computeInitialValues(fieldsRef.current, initialValuesRef.current)
    setValues(resetValues)
    setErrors({})
  }, [computeInitialValues])

  // Memoized CSS classes
  const gapClass = useMemo(() => {
    const gapMap = {
      xs: 'gap-2',
      sm: 'gap-3',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8'
    }
    return gapMap[gap]
  }, [gap])

  const columnsClass = useMemo(() => {
    switch (columns) {
      case 1: return 'grid-cols-1'
      case 2: return 'grid-cols-1 md:grid-cols-2'
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      default: return 'grid-cols-1 md:grid-cols-2'
    }
  }, [columns])

  const actionsAlignmentClass = useMemo(() => {
    const alignmentMap = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
      between: 'justify-between',
      around: 'justify-around'
    }
    return alignmentMap[actionsAlignment]
  }, [actionsAlignment])

  if (loading) {
    return (
      <Card className={className}>
        <CardBody>
          <FormShimmer fields={8} />
        </CardBody>
      </Card>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Section */}
      {(title || subtitle || icon || headerActions) && (
        <div className={`flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 ${headerClassName}`}>
          <div className="flex items-center gap-3">
            {icon && <div className="text-primary">{icon}</div>}
            <div>
              {title && (
                <Typography variant="h4" className="font-semibold text-base-content">
                  {title}
                  {showRequiredIndicator && (
                    <Typography variant="caption" className="text-base-content/60 ml-2">
                      * Required fields
                    </Typography>
                  )}
                </Typography>
              )}
              {subtitle && (
                <Typography variant="body2" className="text-base-content/70">
                  {subtitle}
                </Typography>
              )}
            </div>
          </div>
          {headerActions && (
            <div className="flex items-center gap-2">
              {headerActions}
            </div>
          )}
        </div>
      )}

      {/* Form */}
      <div>
        <div>
          <form onSubmit={handleSubmit} className={formClassName}>
            <div className={`grid ${columnsClass} ${gapClass} ${contentClassName}`}>
              {fields.map((field, index) => (
                <FieldRenderer
                  key={'name' in field ? field.name : `field-${index}`}
                  field={field}
                  values={values}
                  errors={errors}
                  onChange={handleFieldChange}
                />
              ))}
            </div>

            {/* Actions */}
            {actions.length > 0 && (
              <div className={`flex ${actionsAlignmentClass} gap-3 mt-6 pt-6 border-t border-base-300 ${actionsClassName}`}>
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    type={action.type}
                    variant={action.variant || 'primary'}
                    size={action.size || 'md'}
                    disabled={action.disabled || (action.type === 'submit' && isSubmitting)}
                    loading={action.loading || (action.type === 'submit' && isSubmitting)}
                    onClick={action.type === 'reset' ? handleReset : action.onClick}
                    className={`gap-2 ${action.className || ''}`}
                  >
                    {action.icon}
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

// FieldRenderer component remains the same but with updated onChange signature
const FieldRenderer: React.FC<{
  field: FieldConfig
  values: Record<string, any>
  errors: Record<string, string>
  onChange: (name: string, value: any) => void
}> = ({ field, values, errors, onChange }) => {

  // Check conditional rendering
  if ('conditional' in field && field.conditional) {
    const { dependsOn, value: conditionValue, operator = 'equals' } = field.conditional
    const dependentValue = values[dependsOn]

    let shouldRender = false
    switch (operator) {
      case 'equals':
        shouldRender = dependentValue === conditionValue
        break
      case 'notEquals':
        shouldRender = dependentValue !== conditionValue
        break
      case 'includes':
        shouldRender = Array.isArray(dependentValue) && dependentValue.includes(conditionValue)
        break
      case 'notIncludes':
        shouldRender = Array.isArray(dependentValue) && !dependentValue.includes(conditionValue)
        break
    }

    if (!shouldRender) return null
  }

  // Handle non-field types
  if (field.type === 'divider') {
    return (
      <div className={`col-span-full ${field.className || ''}`}>
        <div className="divider">
          {field.label && (
            <Typography variant="body2" className="text-base-content/60">
              {field.label}
            </Typography>
          )}
        </div>
      </div>
    )
  }

  if (field.type === 'heading') {
    return (
      <div className={`col-span-full ${field.className || ''}`}>
        <Typography variant={field.variant || 'h4'} className="font-semibold">
          {field.text}
        </Typography>
      </div>
    )
  }

  if (field.type === 'spacer') {
    const sizeMap = {
      xs: 'h-2',
      sm: 'h-4',
      md: 'h-6',
      lg: 'h-8',
      xl: 'h-12'
    }
    return <div className={`col-span-full ${sizeMap[field.size || 'md']}`}></div>
  }

  // Get grid column classes
  const getGridCols = (cols?: number) => {
    switch (cols) {
      case 1: return 'col-span-1'
      case 2: return 'col-span-2'
      case 3: return 'col-span-3'
      case 4: return 'col-span-4'
      case 6: return 'col-span-6'
      case 12: return 'col-span-full'
      default: return 'col-span-1'
    }
  }

  const fieldValue = values[field.name]
  const fieldError = errors[field.name]
  
  // Create a stable handler for this field
  const handleChange = useCallback((value: any) => {
    onChange(field.name, value)
  }, [field.name, onChange])

  // Ensure we always have a defined value for controlled components
  const getControlledValue = (value: any, fieldType: string) => {
    if (value !== undefined && value !== null) return value

    switch (fieldType) {
      case 'input':
      case 'textarea':
        return ''
      case 'select':
        return ''
      case 'multiSelect':
      case 'checkbox':
        return []
      case 'toggle':
        return false
      case 'rating':
        return 0
      case 'range':
        return 0
      default:
        return ''
    }
  }

  const renderField = () => {
    switch (field.type) {
      case 'input':
        return (
          <Input
            label={field.label}
            placeholder={field.placeholder}
            type={field.inputType || 'text'}
            value={getControlledValue(fieldValue, 'input')}
            onChange={(e) => handleChange(e.target.value)}
            startIcon={field.startIcon}
            endIcon={field.endIcon}
            min={field.min}
            max={field.max}
            step={field.step}
            required={field.required}
            size={field.size || 'md'}
            variant={field.variant as any}
            disabled={field.disabled}
            error={fieldError}
            helperText={field.helperText}
            className={field.className}
          />
        )

      case 'textarea':
        return (
          <Textarea
            label={field.label}
            placeholder={field.placeholder}
            value={getControlledValue(fieldValue, 'textarea')}
            onChange={(e) => handleChange(e.target.value)}
            rows={field.rows}
            required={field.required}
            size={field.size || 'md'}
            variant={field.variant as any}
            disabled={field.disabled}
            error={fieldError}
            helperText={field.helperText}
            className={field.className}
          />
        )

      case 'select':
        return (
          <Select
            label={field.label}
            placeholder={field.placeholder}
            options={field.options}
            value={getControlledValue(fieldValue, 'select')}
            onChange={handleChange}
            size={field.size || 'md'}
            variant={field.variant as any}
            disabled={field.disabled}
            error={fieldError}
            helperText={field.helperText}
            className={field.className}
          />
        )

      case 'multiSelect':
        return (
          <Select
            label={field.label}
            placeholder={field.placeholder}
            options={field.options}
            value={getControlledValue(fieldValue, 'multiSelect')}
            onChange={handleChange}
            multiSelect={true}
            size={field.size || 'md'}
            variant={field.variant as any}
            disabled={field.disabled}
            error={fieldError}
            helperText={field.helperText}
            className={field.className}
          />
        )

      case 'radio':
        return (
          <div className="form-control">
            {field.label && (
              <label className="label">
                <Typography variant="body2" className="label-text">
                  {field.label}
                  {field.required && <span className="text-error ml-1">*</span>}
                </Typography>
              </label>
            )}
            <Radio
              name={field.name}
              options={field.options}
              value={fieldValue}
              onChange={handleChange}
              disabled={field.disabled}
              size={field.size || 'md'}
            />
            {(fieldError || field.helperText) && (
              <label className="label">
                <span className={`label-text-alt ${fieldError ? 'text-error' : ''}`}>
                  {fieldError || field.helperText}
                </span>
              </label>
            )}
          </div>
        )

      case 'checkbox':
        if (field.single) {
          return (
            <Checkbox
              label={field.label}
              checked={getControlledValue(fieldValue, 'toggle')}
              onChange={(e) => handleChange(e.target.checked)}
              required={field.required}
              size={field.size || 'md'}
              disabled={field.disabled}
              className={field.className}
            />
          )
        } else {
          const checkboxValues = getControlledValue(fieldValue, 'checkbox')
          return (
            <div className="form-control">
              {field.label && (
                <label className="label">
                  <Typography variant="body2" className="label-text">
                    {field.label}
                    {field.required && <span className="text-error ml-1">*</span>}
                  </Typography>
                </label>
              )}
              <div className="flex flex-col gap-2">
                {field.options?.map((option) => (
                  <Checkbox
                    key={option.value}
                    label={option.label}
                    checked={checkboxValues.includes(option.value)}
                    onChange={(e) => {
                      const newValues = e.target.checked
                        ? [...checkboxValues, option.value]
                        : checkboxValues.filter((v: string) => v !== option.value)
                      handleChange(newValues)
                    }}
                    disabled={field.disabled || option.disabled}
                    size={field.size || 'md'}
                  />
                ))}
              </div>
              {(fieldError || field.helperText) && (
                <label className="label">
                  <span className={`label-text-alt ${fieldError ? 'text-error' : ''}`}>
                    {fieldError || field.helperText}
                  </span>
                </label>
              )}
            </div>
          )
        }

      case 'toggle':
        return (
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-4">
              <Toggle
                checked={getControlledValue(fieldValue, 'toggle')}
                onChange={(e) => handleChange(e.target.checked)}
                disabled={field.disabled}
                size={field.size || 'md'}
              />
              <div className="flex flex-col">
                {field.label && (
                  <Typography variant="body2" className="label-text">
                    {field.label}
                    {field.required && <span className="text-error ml-1">*</span>}
                  </Typography>
                )}
                {field.helperText && (
                  <Typography variant="caption" className="text-base-content/60">
                    {field.helperText}
                  </Typography>
                )}
              </div>
            </label>
            {fieldError && (
              <label className="label">
                <span className="label-text-alt text-error">{fieldError}</span>
              </label>
            )}
          </div>
        )

      case 'datePicker':
        return (
          <DatePicker
            label={field.label}
            placeholder={field.placeholder}
            value={fieldValue}
            onChange={handleChange}
            size={field.size || 'md'}
            variant={field.variant as any}
            disabled={field.disabled}
            error={fieldError}
            helperText={field.helperText}
            className={field.className}
          />
        )

      case 'dateRange':
        return (
          <DatePicker
            label={field.label}
            dateRange={true}
            rangeValue={fieldValue}
            onRangeChange={handleChange}
            size={field.size || 'md'}
            variant={field.variant as any}
            disabled={field.disabled}
            error={fieldError}
            helperText={field.helperText}
            className={field.className}
          />
        )

      case 'timePicker':
        return (
          <TimePicker
            label={field.label}
            placeholder={field.placeholder}
            value={fieldValue}
            onChange={handleChange}
            size={field.size || 'md'}
            variant={field.variant as any}
            disabled={field.disabled}
            error={fieldError}
            helperText={field.helperText}
            className={field.className}
          />
        )

      case 'timeRange':
        return (
          <TimePicker
            label={field.label}
            timeRange={true}
            rangeValue={fieldValue}
            onRangeChange={handleChange}
            size={field.size || 'md'}
            variant={field.variant as any}
            disabled={field.disabled}
            error={fieldError}
            helperText={field.helperText}
            className={field.className}
          />
        )

      case 'colorPicker':
        return (
          <ColorPicker
            label={field.label}
            placeholder={field.placeholder}
            value={fieldValue}
            onChange={handleChange}
            showAlpha={field.showAlpha}
            showPresets={field.showPresets}
            showEyeDropper={field.showEyeDropper}
            size={field.size || 'md'}
            variant={field.variant as any}
            disabled={field.disabled}
            error={fieldError}
            helperText={field.helperText}
            className={field.className}
          />
        )

      case 'fileInput':
        return (
          <FileInput
            label={field.label}
            value={fieldValue}
            onChange={handleChange}
            accept={field.accept}
            multiple={field.multiple}
            required={field.required}
            size={field.size || 'md'}
            variant={field.variant as any}
            disabled={field.disabled}
            error={fieldError}
            helperText={field.helperText}
            className={field.className}
          />
        )

      case 'range':
        return (
          <Range
            label={field.label}
            value={getControlledValue(fieldValue, 'range')}
            onChange={handleChange}
            min={field.min}
            max={field.max}
            step={field.step}
            required={field.required}
            size={field.size || 'md'}
            disabled={field.disabled}
            className={field.className}
          />
        )

      case 'rating':
        return (
          <div className="form-control">
            {field.label && (
              <label className="label">
                <Typography variant="body2" className="label-text">
                  {field.label}
                  {field.required && <span className="text-error ml-1">*</span>}
                </Typography>
              </label>
            )}
            <Rating
              value={getControlledValue(fieldValue, 'rating')}
              onChange={handleChange}
              max={field.max}
              size={field.size || 'md'}
              readonly={field.readonly}
            />
            {(fieldError || field.helperText) && (
              <label className="label">
                <span className={`label-text-alt ${fieldError ? 'text-error' : ''}`}>
                  {fieldError || field.helperText}
                </span>
              </label>
            )}
          </div>
        )

      case 'custom':
        return field.render({
          value: fieldValue,
          onChange: handleChange,
          error: fieldError
        })

      case 'iconPicker':
        return (
          <IconPicker
            label={field.label}
            value={getControlledValue(fieldValue, 'input')}
            onChange={handleChange}
            iconSize={field.iconSize}
            showPreview={field.showPreview}
            required={field.required}
            disabled={field.disabled}
            error={fieldError}
            helperText={field.helperText}
            className={field.className}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className={getGridCols('gridCols' in field ? field.gridCols : 1)}>
      {renderField()}
    </div>
  )
}

// Updated IconPicker component that uses InfinityIcons
const IconPicker: React.FC<{
  label?: string
  value?: string
  onChange: (value: string) => void
  error?: string
  helperText?: string
  required?: boolean
  disabled?: boolean
  iconSize?: number
  showPreview?: boolean
  className?: string
}> = ({
  label,
  value,
  onChange,
  error,
  helperText,
  disabled,
  iconSize = 20,
  showPreview = true,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIcon, setSelectedIcon] = useState(value || '')

  useEffect(() => {
    setSelectedIcon(value || '')
  }, [value])

  const handleIconSelect = (iconName: string) => {
    setSelectedIcon(iconName)
    onChange(iconName)
    setIsOpen(false)
  }

  const handleClear = () => {
    setSelectedIcon('')
    onChange('')
  }

  return (
    <div className={`form-control ${className}`}>
      {label && (
        <label className="label">
          <Typography variant="body2" className="label-text">
            {label}
          </Typography>
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(true)}
          disabled={disabled}
          className={`btn btn-outline w-full justify-start gap-3 ${
            error ? 'btn-error' : ''
          } ${disabled ? 'btn-disabled' : ''}`}
        >
          {selectedIcon ? (
            <>
              {showPreview && (
                <div className="flex items-center justify-center w-5 h-5">
                  {getIconComponent(selectedIcon, iconSize)}
                </div>
              )}
              <span className="flex-1 text-left truncate font-mono text-sm">
                {selectedIcon}
              </span>
            </>
          ) : (
            <span className="flex-1 text-left text-base-content/50">
              Select an icon...
            </span>
          )}
          
          <div className="flex items-center gap-1">
            {selectedIcon && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleClear()
                }}
                className="btn btn-ghost btn-xs"
                disabled={disabled}
              >
                {getIconComponent('X', 12)}
              </button>
            )}
            {getIconComponent('ChevronDown', 16)}
          </div>
        </button>
      </div>

      {(error || helperText) && (
        <label className="label">
          <span className={`label-text-alt ${error ? 'text-error' : ''}`}>
            {error || helperText}
          </span>
        </label>
      )}

      {/* Icon Selection Modal using InfinityIcons */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h5" className="font-semibold">
                Select an Icon
              </Typography>
              <Typography variant="body2" className="text-base-content/60">
                Choose an icon from the available collection
              </Typography>
            </div>
          </div>

          {/* Selected Icon Preview */}
          {selectedIcon && (
            <div className="bg-base-200 rounded-lg p-4">
              <Typography variant="caption" className="text-base-content/60">
                Selected Icon:
              </Typography>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center justify-center w-8 h-8 bg-base-100 rounded">
                  {getIconComponent(selectedIcon, 24)}
                </div>
                <Typography variant="body2" className="font-mono">
                  {selectedIcon}
                </Typography>
              </div>
            </div>
          )}

          {/* Use InfinityIcons component with click handlers */}
          <div className="max-h-96 overflow-y-auto">
            <IconSelectionWrapper 
              onSelect={handleIconSelect}
              selectedIcon={selectedIcon}
              iconSize={iconSize}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}

// Wrapper component to handle click events on InfinityIcons
const IconSelectionWrapper: React.FC<{
  onSelect: (iconName: string) => void
  selectedIcon?: string
  iconSize?: number
}> = ({ onSelect, selectedIcon, iconSize = 20 }) => {
  const handleIconClick = useCallback((event: React.MouseEvent) => {
    // Find the clicked icon button
    const target = event.target as HTMLElement
    const iconButton = target.closest('[data-icon-name]') || target.closest('.card')
    
    if (iconButton) {
      // Try to get icon name from data attribute first
      let iconName = iconButton.getAttribute('data-icon-name')
      
      // If no data attribute, try to extract from tooltip or other means
      if (!iconName) {
        const tooltip = iconButton.getAttribute('title')
        if (tooltip) {
          iconName = tooltip
        }
      }
      
      // If still no icon name, try to find SVG and extract from class or other attributes
      if (!iconName) {
        const svg = iconButton.querySelector('svg')
        if (svg) {
          // Extract icon name from SVG classes or data attributes
          const classes = svg.className.baseVal || svg.getAttribute('class') || ''
          const match = classes.match(/lucide-([a-z-]+)/i)
          if (match) {
            // Convert kebab-case to PascalCase
            iconName = match[1].replace(/-([a-z])/g, (_:any, letter:any) => letter.toUpperCase())
            if (iconName) {
              iconName = iconName.charAt(0).toUpperCase() + iconName.slice(1)
            }
          }
        }
      }
      
      if (iconName) {
        onSelect(iconName)
      }
    }
  }, [onSelect])

  return (
    <div onClick={handleIconClick} className="cursor-pointer">
      <InfinityIcons 
        iconSize={iconSize}
        className="w-full"
        cardClassName={`transition-all hover:ring-2 hover:ring-primary ${
          selectedIcon ? 'ring-2 ring-primary' : ''
        }`}
      />
    </div>
  )
}

// Remove the InfinityIconSelector component since we're now using InfinityIcons
// ... (keep the rest of the component unchanged)

// FormShimmer component remains the same
const FormShimmer: React.FC<{ fields: number }> = ({ fields }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="h-8 bg-base-300 rounded w-1/3 animate-pulse"></div>
        <div className="h-4 bg-base-300 rounded w-1/2 animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: fields }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-4 bg-base-300 rounded w-1/4 animate-pulse"></div>
            <div className="h-12 bg-base-300 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 justify-end">
        <div className="h-10 w-20 bg-base-300 rounded animate-pulse"></div>
        <div className="h-10 w-24 bg-base-300 rounded animate-pulse"></div>
      </div>
    </div>
  )
}