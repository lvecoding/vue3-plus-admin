/** 分割原始数组，转换成每组指定数量的二位数组 */
export function chunkArray<T>(arr: T[], chunkSize: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize))
  }
  return result
}

/** 格式化商品岗位数据，输出形式：{ label： xxx, value: xxx } */
export const handleFormatSelect = list => {
  if (!list || !list.length) {
    return []
  }
  const newList = list.map(item => {
    return {
      label: item.name,
      value: item.id,
      children: item.children ? handleFormatSelect(item.children) : []
    }
  })
  return newList
}
