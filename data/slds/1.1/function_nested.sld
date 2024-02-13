<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<StyledLayerDescriptor
  version="1.1.0"
  xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd"
  xmlns="http://www.opengis.net/sld"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:se="http://www.opengis.net/se"
>
  <NamedLayer>
    <se:Name>OL Style</se:Name>
    <UserStyle>
      <se:Name>OL Style</se:Name>
      <FeatureTypeStyle>
        <se:Rule>
          <se:Name>OL Style Rule 0</se:Name>
          <se:PolygonSymbolizer>
            <se:Fill>
              <SvgParameter name="fill">#F1337F</SvgParameter>
            </se:Fill>
            <se:Stroke>
              <SvgParameter name="stroke-width">
                <ogc:Function name="max">
                  <ogc:Function name="pi" />
                  <ogc:Function name="strLength">
                    <ogc:Literal>Peter</ogc:Literal>
                  </ogc:Function >
                </ogc:Function >
              </SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
